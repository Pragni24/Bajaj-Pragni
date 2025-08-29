from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/bfhl', methods=['POST'])
def bfhl():
    try:
        input_data = request.get_json()["data"]
        full_name = "pragni_naik"
        dob = "24072004"
        email = "pragninaik2@gmail.com"
        roll_number = "22BCE10712"
        user_id = f"{full_name.lower()}_{dob}"

        numbers = []
        alphabets = []
        special_characters = []

        for item in input_data:
            val = str(item)
            if val.isdigit():
                numbers.append(val)
            elif val.isalpha():
                alphabets.append(val.upper())
            else:
                for c in val:
                    if c.isdigit():
                        numbers.append(c)
                    elif c.isalpha():
                        alphabets.append(c.upper())
                    else:
                        special_characters.append(c)

        even_numbers = [n for n in numbers if int(n) % 2 == 0]
        odd_numbers = [n for n in numbers if int(n) % 2 != 0]
        sum_numbers = str(sum(map(int, numbers))) if numbers else "0"
        concat_string = "".join([a.capitalize() if idx % 2 == 0 else a.lower() for idx, a in enumerate("".join(alphabets)[::-1])])

        response = {
            "is_success": True,
            "user_id": user_id,
            "email": email,
            "roll_number": roll_number,
            "odd_numbers": odd_numbers,
            "even_numbers": even_numbers,
            "alphabets": alphabets,
            "special_characters": special_characters,
            "sum": sum_numbers,
            "concat_string": concat_string
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({
            "is_success": False,
            "error": str(e)
        }), 400

import os

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Use PORT env var or default 5000
    app.run(host='0.0.0.0', port=port)
