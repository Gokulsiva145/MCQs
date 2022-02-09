import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import editOutline from "@iconify/icons-eva/edit-outline";
import { Link as RouterLink } from "react-router-dom";
import clipboardOutline from "@iconify/icons-eva/clipboard-outline";
import questionMarkCircleOutline from "@iconify/icons-eva/question-mark-circle-outline";
import option2Uutline from "@iconify/icons-eva/options-2-outline";
import trash2Outline from "@iconify/icons-eva/trash-2-outline";
import moreVerticalFill from "@iconify/icons-eva/more-vertical-fill";
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// ----------------------------------------------------------------------
// import FormDialog from "./Modal";
// import { getDateRangePickerDayUtilityClass } from "@mui/lab";

export default function ExamMoreMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async (examId) => {
    setIsOpen(false);
    await fetch(`http://localhost:5000/schedules/${examId}`, {
      method: "delete",
    }).then(() => {
      props.onAfterDelete();
    });
  };

  return (
    <>
      <IconButton
        ref={ref}
        onClick={() => {
          props.onChangeData(props.data);
          setIsOpen(true);
        }}
      >
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: "100%" },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          component={RouterLink}
          to={`questions`}
          state={{ examId: props.data.examId, examCode: props.data.examCode }}
          sx={{ color: "text.secondary" }}
        >
          <ListItemIcon>
            <Icon icon={questionMarkCircleOutline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Questions"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
        {props.data.examType === 0 && (
          <MenuItem
            component={RouterLink}
            to={`result`}
            state={{
              examId: props.data.examId,
              examCode: props.data.examCode,
              passMark: props.data.passMark,
            }}
            sx={{ color: "text.secondary" }}
          >
            <ListItemIcon>
              <Icon icon={clipboardOutline} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary="Results"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </MenuItem>
        )}
        {props.data.examType === 0 && (
          <MenuItem
            component={RouterLink}
            to={`access`}
            state={{ examId: props.data.examId, examCode: props.data.examCode }}
            sx={{ color: "text.secondary" }}
          >
            <ListItemIcon>
              <Icon icon={option2Uutline} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary="Access"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </MenuItem>
        )}
        <MenuItem
          sx={{ color: "text.secondary" }}
          onClick={() => {
            props.openModal(true);
            setIsOpen(false);
          }}
        >
          <ListItemIcon>
            <Icon icon={editOutline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Edit"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
        <MenuItem
          sx={{ color: "text.secondary" }}
          onClick={() => {
            handleDelete(props.data.examId);
          }}
        >
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
