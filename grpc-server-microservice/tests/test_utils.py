import sys, os
import unittest
sys.path.append("..")
from app.utils import percentageGrossValue, getPercentageValue

class TestUtilsMethods(unittest.TestCase):
    def test_percentageGrossValue(self):
        total_price = 100
        percent     = float(10)
        result      = percentageGrossValue(total_price=total_price, percent=percent)
        self.assertEqual(result, 10)

    def test_percentageGrossValue_invalid_input(self):
        self.assertRaises(TypeError, percentageGrossValue, 100, str(10))
        self.assertRaises(TypeError, percentageGrossValue, str(10), 10)

    def test_percentageGrossValue_missing_input(self):
        total_price = 100
        self.assertRaises(TypeError, percentageGrossValue, total_price)

    def test_getPercentageValue(self):
        total_price     = 120
        discount_value  = 12
        value = getPercentageValue(total_price, discount_value)
        self.assertEqual(value, 10)
