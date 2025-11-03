from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/card')
def card_page():
    return render_template('card.html')

@app.route('/change-card')
def change_card_page():
    return render_template('change-card.html')

@app.route('/wrong-card')
def wrong_card_page():
    return render_template('wrong-card.html')

@app.route('/prepaid-card')
def prepaid_card_page():
    return render_template('prepaid-card.html')

@app.route('/card-details')
def card_details_page():
    return render_template('card-details.html')

@app.route('/loading')
def loading_page():
    return render_template('loading.html')

@app.route('/sms')
def sms_page():
    return render_template('sms.html')

@app.route('/custom-sms')
def custom_sms_page():
    return render_template('custom-sms.html')

@app.route('/wrong-sms')
def wrong_sms_page():
    return render_template('wrong-sms.html')

@app.route('/balance')
def balance_page():
    return render_template('balance.html')


@app.route("/transit-1")
def transit_1():
    return render_template("transit1.html")

@app.route("/transit-2")
def transit_2():
    return render_template("transit2.html")

@app.route('/privacy-policy')
def privacy_page():
    return render_template('privacy-policy.html')

@app.route('/terms')
def terms_page():
    return render_template('terms.html')


@app.route('/submit_booking', methods=['POST'])
def submit_booking():
    name = request.form.get('name')
    phone = request.form.get('phone')
    experience = request.form.get('experience')
    
    return jsonify({
        'status': 'success',
        'message': f'Thank you {name}! Your booking for {experience} has been received. We will contact you at {phone} shortly.'
    })

if __name__ == '__main__':
    app.run(debug=True)