import Chip from "@mui/material/Chip";

/**
 * 统一的优先级标签组件
 * @param {Object} props
 * @param {"high"|"medium"|"low"} props.priority - 优先级
 * @param {"small"|"medium"} [props.size="small"] - 尺寸
 */
export default function PriorityChip({ priority, size = "small" }) {
  if (priority === "high") {
    return <Chip size={size} label="紧急" color="error" />;
  }
  if (priority === "medium") {
    return <Chip size={size} label="一般" color="warning" />;
  }
  return <Chip size={size} label="低" color="default" />;
}
