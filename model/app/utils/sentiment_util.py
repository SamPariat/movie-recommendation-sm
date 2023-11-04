from .naive_bayes_util import NaiveBayesUtil
from sklearn.feature_extraction.text import CountVectorizer
from .text_utils import TextUtils


class SentimentUtil:
    def __init__(self):
        self.nbu = NaiveBayesUtil()

        self.naive_bayes = self.nbu.load_model(
            pkl_file_name='naive_bayes')
        self.vocab = self.nbu.load_model(pkl_file_name='vocab')
        self.cv = CountVectorizer(vocabulary=self.vocab)

        self.tu = TextUtils()

    def text_preprocessing(self, text):
        text = self.tu.clean_html(text)
        text = self.tu.convert_lower(text)
        text = self.tu.remove_special_characters(text)
        text = self.tu.remove_stopwords(text)
        text = self.tu.stem_words(text)
        text = self.tu.convert_split_list_to_string(text)
        text = [text]
        print(text)
        text = self.cv.transform(text)

        return text

    def get_sentiment(self, text: str):
        nb_model = self.nbu.load_model(pkl_file_name='naive_bayes')

        text = self.text_preprocessing(text)

        return 'Positive' if nb_model.predict(text)[0] == 1 else 'Negative'
