import pickle

import face_recognition
from os import path, walk

import numpy as np


class Face:
    def __init__(self, app):
        self.storage = app.config["storage"]
        self.db = app.db
        self.faces = []
        self.known_encoding_faces = []  # faces data for recognition
        self.face_user_keys = {}
        self.registered_user_ids = []

    def load_user_by_index_key(self, index_key=0):

        key_str = str(index_key)

        if key_str in self.face_user_keys:
            return self.face_user_keys[key_str]

        return None

    def load_train_file_by_name(self, name):
        trained_storage = path.join(self.storage, 'registered_users')
        return path.join(trained_storage, name)

    def load_unknown_file_by_name(self, name):
        unknown_storage = path.join(self.storage, 'captured_images')
        return path.join(unknown_storage, name)

    def load_all(self):
        self.faces = []  # storage all faces in caches array of face object
        self.known_encoding_faces = []  # faces data for recognition
        self.face_user_keys = {}
        results = self.db.select('SELECT user_id, name, face_encodings FROM registered_users')

        for row in results:

            user_id = row[0]
            name = row[1]
            face_encoding = pickle.loads(row[2])
            index_key = len(self.known_encoding_faces)
            self.known_encoding_faces.append(face_encoding)
            index_key_string = str(index_key)
            self.face_user_keys['{0}'.format(index_key_string)] = user_id
            self.registered_user_ids.append(user_id)

    def recognize(self, unknown_filename):

        self.load_all()
        unknown_image = face_recognition.load_image_file(self.load_unknown_file_by_name(unknown_filename))

        detected_userids =[]
        final_results= []
        # Detect faces
        face_locations = face_recognition.face_locations(unknown_image)
        # Encore faces
        face_encodings = face_recognition.face_encodings(unknown_image, face_locations, 50)
        # Loop in all detected faces
        for face_encoding in face_encodings:
            # See if the face is a match for the known face (that we saved in the precedent step)
            matches = face_recognition.compare_faces(self.known_encoding_faces, face_encoding, 0.5)
            # check the known face with the smallest distance to the new face
            face_distances = face_recognition.face_distance(self.known_encoding_faces, face_encoding)
            # Take the best one
            best_match_index = np.argmin(face_distances)
            # if we have a match:
            if matches[best_match_index]:
                # Give the detected face the name of the employee that match
                user_id = self.load_user_by_index_key(best_match_index)
                detected_userids.append(user_id)
        for user_id in self.registered_user_ids:
            result_tuple = (user_id, 1 if user_id in detected_userids else 0)
            final_results.append(result_tuple)
        return final_results
