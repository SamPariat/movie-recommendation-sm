import re
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer


class TextUtils:
    def __init__(self):
        self.ps = PorterStemmer()

    def clean_html(self, text):
        clean = re.compile('<.*?>')
        return re.sub(clean, '', text)

    def convert_lower(self, text):
        return text.lower()

    def remove_special_characters(self, text):
        result_string = ''

        for character in text:
            if character.isalnum():
                result_string += character
            else:
                result_string += ' '

        return result_string

    def remove_stopwords(self, text):
        stopwords_set = set(stopwords.words('english'))

        no_stop_words = []
        for word in text.split():
            if word not in stopwords_set:
                no_stop_words.append(word)

        final_list = no_stop_words[:]
        no_stop_words.clear()
        return final_list

    def stem_words(self, text):
        stemmed_words = []
        for word in text:
            stemmed_words.append(self.ps.stem(word))

        final_list = stemmed_words[:]
        stemmed_words.clear()
        return final_list

    def convert_split_list_to_string(self, text_list):
        return " ".join(text_list)
