def percentageGrossValue(total_price: int, percent: float) -> float:
    grossValue = total_price * percent / 100
    return grossValue

def getPercentageValue(total_price: int, discount_value: int) -> float:
    percentValue = discount_value * total_price / 100
    return percentValue