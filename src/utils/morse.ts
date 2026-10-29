const morse: Record<string, string> = {
    ".-": "A", "-...": "B", "-.-.": "C", "-..": "D", ".": "E", "..-.": "F", "--.": "G",
    "....": "H", "..": "I", ".---": "J", "-.-": "K", ".-..": "L", "--": "M", "-.": "N",
    "---": "O", ".--.": "P", "--.-": "Q", ".-.": "R", "...": "S", "-":"T", "..-": "U", 
    "...-": "V", ".--": "W", "-..-": "X", "-.--": "Y", "--..": "Z",
};

const reverseMap: Record<string,string> = Object.fromEntries(
    Object.entries(morse).map(([code, letter]) => [letter, code])
);

export function decodeMorse(input: string): string{
    return input
    .trim()
    .split(/\s+/)
    .map((code) =>  morse[code] ?? "?")
    .join("");
}

export function encodeMorse(word: string): string{
    return word
    .toUpperCase()
    .split("")
    .map((letter) => {
        const code = reverseMap[letter];
        if(!code) throw new Error(`No morse for ${letter}`);
        return code;
    })
    .join(" ");
}