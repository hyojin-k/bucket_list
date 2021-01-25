from pymongo import MongoClient
from flask import Flask, render_template, jsonify, request
from datetime import datetime


app = Flask(__name__)
client = MongoClient('localhost', 27017)

db = client.bucketlist

@app.route('/')
def home():
    return render_template('index.html')

# 리스트 입력
@app.route('/list', methods=['POST'])
def write_list():
    name_receive = request.form['name_give']
    goal_receive = request.form['goal_give']
    now_receive = request.form['now_give']
    how_receive = request.form['how_give']

    bucketlist = {
        'name' : name_receive,
        'goal': goal_receive,
        'now': now_receive,
        'how': how_receive,
        'time': datetime.now()
    }

    db.bucketlists.insert_one(bucketlist)
    return jsonify({'result':'success', 'msg':'버킷리스트가 추가되었습니다'})


@app.route('/list', methods=['GET'])
def get_list():
    bucketlists = list(db.bucketlists.find({}, {'_id':0}).sort('time',-1))
    return jsonify({'result':'success', 'bucketlists':bucketlists})

# 달성률 down
@app.route('/list/percent_down', methods=['POST'])
def down_percent():
    name_receive = request.form['name_give']
    percent = db.bucketlists.find_one({'name':name_receive})
    new_now = int(percent['now']) - 10
    if new_now < 0:
        pass
    else :
        db.bucketlists.update_one({'name':name_receive}, {'$set':{'now':new_now}})
    return jsonify({'result': 'success'})

# 달성률 up
@app.route('/list/percent_up', methods=['POST'])
def up_percent():
    name_receive = request.form['name_give']
    percent = db.bucketlists.find_one({'name':name_receive})
    new_now = int(percent['now']) + 10
    if new_now > 100:
        pass
    else :
        db.bucketlists.update_one({'name':name_receive}, {'$set':{'now':new_now}})
    return jsonify({'result': 'success'})

# 리스트 수정
@app.route('/list/edit', methods=['POST'])
def edit_list():
    name_receive = request.form['name_give']
    how_receive = request.form['how_give']
    db.bucketlists.update_one({'name':name_receive}, {'$set':{'how':how_receive}})
    return jsonify({'result': 'success'})

# 리스트 지우기
@app.route('/list/delete', methods=['POST'])
def delete_list():
    name_receive = request.form['name_give']
    db.bucketlists.delete_one({'name':name_receive})
    return jsonify({'result': 'success'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=7000, debug=True)