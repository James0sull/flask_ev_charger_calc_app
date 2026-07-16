from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    charging_time = None
    battery_size = None
    charger_power = None

    if request.method == "POST":
        try:
            # Grab the numbers entered by the user in the HTML form
            battery_size = float(request.form.get("battery_size", 0))
            charger_power = float(request.form.get("charger_power", 1))

            # Math formula: Time (hours) = Battery Capacity (kWh) / Charger Power (kW)
            if charger_power > 0:
                charging_time = round(battery_size / charger_power, 2)
        except ValueError:
            charging_time = "Error: Please enter valid numbers."

    return render_template("index.html", 
                           charging_time=charging_time, 
                           battery_size=battery_size, 
                           charger_power=charger_power)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)