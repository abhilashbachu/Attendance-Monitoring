import face_recognition
from flask import Flask, json, Response, request, render_template
from werkzeug.utils import secure_filename
import pickle
from os import path, getcwd
import time
from db import Database
from face import Face
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['file_allowed'] = ['image/png', 'image/jpeg']
app.config['storage'] = path.join(getcwd(), 'storage')
app.db = Database()
app.face = Face(app)


def success_handle(output, status=200, mimetype='application/json'):
    return Response(output, status=status, mimetype=mimetype)


def error_handle(error_message, status=500, mimetype='application/json'):
    return Response(json.dumps({"error": {"message": error_message}}), status=status, mimetype=mimetype)


@app.route('/user/register', methods=['POST'])
def train():
    output = json.dumps({"success": True})

    if 'file' not in request.files:

        print("user image is required")
        return error_handle("User image is required.")
    else:

        print("File request", request.files)
        file = request.files['file']

        if file.mimetype not in app.config['file_allowed']:

            print("File extension is not allowed")

            return error_handle("We only allow upload file with *.png , *.jpg")
        else:

            # get name in form data
            name = request.form['name']
            userId = request.form['userId']
            fileName, fileExtension = path.splitext(file.filename)

            print("Information of that face", name)
            print(fileExtension)

            print("File is allowed and will be saved in ", app.config['storage'])
            filename = secure_filename(userId + fileExtension)
            trained_storage = path.join(app.config['storage'], 'registered_users')
            file.save(path.join(trained_storage, filename))
            face = face_recognition.load_image_file(file)
            face_encoding = face_recognition.face_encodings(face, num_jitters=50)[0]
            face_pickled_data = pickle.dumps(face_encoding)
            # let start save file to our storage

            # save to our sqlite database.db
            created = int(time.time())
            user_id = app.db.insert('INSERT INTO registered_users(user_id, name, face_encodings) values(?,?,?)',
                                    [userId, name, face_pickled_data])

    return success_handle(output)


# send capturedImage
@app.route('/capturedImage', methods=['POST'])
def recognize():
    if 'file' not in request.files:
        return error_handle("Image is required")
    else:
        file = request.files['file']
        # file extension valiate
        if file.mimetype not in app.config['file_allowed']:
            return error_handle("File extension is not allowed")
        else:

            filename = secure_filename(file.filename)
            unknown_storage = path.join(app.config["storage"], 'captured_images')
            file_path = path.join(unknown_storage, filename)
            file.save(file_path)

            attendance_result = app.face.recognize(filename)
            app.db.insertMany('INSERT INTO user_attendance(user_id, isPresent) VALUES(?,?);', attendance_result)
            return success_handle(json.dumps(attendance_result))


# route for user profile

@app.route('/users/attendance', methods=['GET'])
def getUserAttendance():
    users_attendace = []
    results = app.db.select('select user_attendance.user_id, registered_users.name, user_attendance.isPresent, user_attendance.createdDate from user_attendance join registered_users where user_attendance.user_id = registered_users.user_id')
    for row in results:
        user_details = {}
        user_details['user_id'] = row[0]
        user_details['name'] = row[1]
        user_details['isPresent'] = row[2]
        user_details['createdDate'] = row[3]
        users_attendace.append(user_details)
    return success_handle(json.dumps(users_attendace));

@app.route('/getAllUsers', methods=['GET'])
def getAllUsers():
    users_attendace = []
    results = app.db.select('select user_id, name from registered_users')
    for row in results:
        user_details = {}
        user_details['user_id'] = row[0]
        user_details['name'] = row[1]
        users_attendace.append(user_details)
    return success_handle(json.dumps(users_attendace));



# Run the app
app.run()
