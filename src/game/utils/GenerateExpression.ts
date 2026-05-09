

import Random from "./Random";
const operators = ["+", "-", "×", ":"];
export default class GenerateExpression{
    public static minNumber = 1;
    public static maxNumber = 10;

    static generateExpression(){
        const ID = Random.randomID(operators.length);
        const operation = operators[ID];
        const numbers = this.generateNumbers(operation);
        const answer = this.calculateAnswer(numbers[0], numbers[1], operation);

        return {operation, numbers, answer};
    }

    private static generateNumbers(type: string): [number, number] {
        let num1: number = Math.floor(Math.random() * this.maxNumber) + this.minNumber;
        let num2: number = Math.floor(Math.random() * this.maxNumber) + this.minNumber;

        if (type === "-" && num1 < num2) {
            [num1, num2] = [num2, num1];
        } else if (type === ":") {
            num1 = num2 * (Math.floor(Math.random() * this.maxNumber) + 1);
        }

        return [num1, num2];
    }

    private static calculateAnswer(num1: number, num2: number, type: string): number {
        return type === "+"
            ? num1 + num2
            : type === "-"
            ? num1 - num2
            : type === "×"
            ? num1 * num2
            : num1 / num2;
    }
}