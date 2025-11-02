from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/health')
def health():
    return jsonify(status='ok')

@app.route('/api/calc', methods=['GET', 'POST'])
def calc():
    if request.method == 'POST':
        data = request.get_json() or {}
        a = data.get('a')
        b = data.get('b')
        op = data.get('op')
    else:
        a = request.args.get('a')
        b = request.args.get('b')
        op = request.args.get('op')

    try:
        a = float(a)
        b = float(b)
    except (TypeError, ValueError):
        return jsonify(error='Invalid operands'), 400

    if op == 'add':
        res = a + b
    elif op == 'sub':
        res = a - b
    elif op == 'mul':
        res = a * b
    elif op == 'div':
        if b == 0:
            return jsonify(error='Division by zero'), 400
        res = a / b
    else:
        return jsonify(error='Invalid op (add, sub, mul, div)'), 400

    return jsonify(result=res)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
