def generate_logs(total_miles, cycle_used):

    AVG_SPEED = 50
    MAX_DRIVE = 11
    FUEL_EVERY = 1000

    drive_hours = total_miles / AVG_SPEED

    logs = []
    remaining = drive_hours
    miles_left = total_miles
    day = 1

    while remaining > 0:

        drive_today = min(MAX_DRIVE, remaining)

        fuel_stop = miles_left >= FUEL_EVERY

        on_duty = drive_today + 2
        off_duty = 24 - on_duty

        logs.append({
            "day":day,
            "driving_hours":round(drive_today,2),
            "on_duty_hours":round(on_duty,2),
            "off_duty_hours":round(off_duty,2),
            "fuel_stop":fuel_stop
        })

        miles_left -= drive_today * AVG_SPEED
        remaining -= drive_today
        day += 1

    return logs
