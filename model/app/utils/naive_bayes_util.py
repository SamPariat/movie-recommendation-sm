import os
import pickle
from .text_utils import TextUtils


class NaiveBayesUtil:
    def __init__(self):
        self.tu = TextUtils()

    def load_model(self, pkl_file_name: str):
        script_dir = os.path.dirname(os.path.abspath(__file__))

        pkl_path = os.path.join(script_dir, f'../../{pkl_file_name}.pkl')
        fit_model = pickle.load(open(pkl_path, 'rb'))

        return fit_model
