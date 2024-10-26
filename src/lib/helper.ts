export function shuffleArray<T>(array: T[]): T[] {
    // Fisher-Yates (Knuth) Shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to return a greeting message
export function greetPerson(personName: string): string {
    return `Hi, ${personName}!`;
}