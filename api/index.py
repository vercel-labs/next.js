from flask import Flask

app = Flask(__name__)


@app.route('/api/hello', methods=['GET'])
def hello_world():
    return "Hello! This is Arnaud, from Flask"


if __name__ == '__main__':
    app.run(debug=True, port=5328)
