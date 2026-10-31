export function wrap(text: string, cols: number): string[] {
    const out: string[] = [];
    for(const para of text.split('\n')){
        if(para === ""){
            out.push("");
            continue;
        }
        let line = "";
        for(const word of para.split(" ")){
            if(word.length > cols){
                if(line){
                    out.push(line);
                    line = "";
                }
                for(let i = 0; i < word.length; i+=cols){
                    out.push(word.slice(i, i + cols));
                }
                continue
            }
            if(!line)line = word;
            else if((line + "" + word).length <= cols)line += " " + word;
            else{
                out.push(line);
                line = word;
            }
        }
        if(line)out.push(line);
    }
    return out;
}

export function garble(s: string, strength: number, seed: number): string{
    const p = Math.max(0, (90 - strength)/90);
    if(p === 0)return s;

    return s.split("").map((ch,i) => {
        if(ch === " ")return ch;
        const r = Math.abs(Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453) % 1;
        return r < p? "?":ch;
    }).join("");
}