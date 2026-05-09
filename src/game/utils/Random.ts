

export default class Random{
    static randomLanes(){
        const laneId: number = Math.floor(Math.random() * 5);
        const side: number = Math.floor(Math.random() * 2);
        return {laneId, side}
    };

    static randomEnemy(){
        const Id: number = Math.floor(Math.random()*5) + 1;
        return Id;
    }

    static randomID(maxID: number){
        const ID: number = Math.floor(Math.random()* maxID);
        return ID;
    }

    static randomPower(){
        const power = ["book", "ice", "bomb"]
        const ID: number = Math.floor(Math.random()*3);
        return power[ID];
    }

    static randomRange(start: number, end: number){
        const x = Phaser.Math.Between(start, end);
        return x;
    }

    static generateOptions(correctAnswer: number, howMany: number): number[] {
        const options: Set<number> = new Set();
        const randomIndex: number = Math.floor(Math.random() * howMany);
        let i: number = 0;

        while (options.size < howMany) {
            if (i === randomIndex) {
                options.add(correctAnswer);
            } else {
                const randomAnswer: number = correctAnswer + Math.floor(Math.random() * 10) - 5;
                if (randomAnswer !== correctAnswer && randomAnswer >= 0) {
                    options.add(randomAnswer);
                }
            }
            i++;
        }

        return Array.from(options);
    }
}