export default function ToolTip(props) {
    return (
        <div className="tooltip">
            {props.element}
            <span className="tooltip-body"><p className="tooltip-text ft-1">{props.tooltipText}</p></span>
        </div>
    )


}