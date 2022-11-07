import { CSSProperties } from "react";

export default function NoResult({ text, styles, textStyles }: { text: string, styles?: CSSProperties, textStyles?: CSSProperties }) {
    return (
        <div className="noResults" style={styles}>
            <h3 style={textStyles}>{text}</h3>
        </div>
    )
}