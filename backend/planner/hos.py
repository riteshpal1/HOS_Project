def generate_eld_logs(total_miles, cycle_used):

    speed = 50
    max_drive = 11
    cycle_limit = 70

    total_drive_hours = total_miles / speed
    remaining_cycle = cycle_limit - cycle_used

    logs = []
    day = 1

    while total_drive_hours > 0 and remaining_cycle > 0:

        drive_today = min(max_drive, total_drive_hours)

        on_duty = drive_today + 2   # 1 hr pickup + 1 hr drop
        off_duty = 24 - on_duty

        logs.append({
            "day": day,
            "driving_hours": round(drive_today,2),
            "on_duty_hours": round(on_duty,2),
            "off_duty_hours": round(off_duty,2)
        })

        total_drive_hours -= drive_today
        remaining_cycle -= drive_today
        day += 1

    fuel_stops = int(total_miles // 1000)

    return logs, fuel_stops