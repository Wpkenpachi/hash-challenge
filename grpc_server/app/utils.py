def percentageGrossValue(total_price: int, percent: float) -> float:
    if percent > 100:
        percent = 100
    grossValue = total_price * percent / 100
    return grossValue

def getPercentageValue(total_price: int, discount_value: int) -> float:
    if discount_value > total_price:
        return 0
    percentValue = total_price / discount_value
    return percentValue