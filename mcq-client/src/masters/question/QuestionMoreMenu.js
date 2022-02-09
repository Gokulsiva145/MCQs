import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
// import { Link as RouterLink } from "react-router-dom";
import editOutline from "@iconify/icons-eva/edit-outline";
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

export default function QuestionMoreMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (questionId) => {
    fetch(`http://localhost:5000/questions/${questionId}`, {
      method: "delete",
    }).then((res) => {
      props.onAfterDelete();
    });
  };

  return (
    <>
      <IconButton
        ref={ref}
        onClick={() => {
          props.openForm(false);
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
          state={{ data: props.data }}
          sx={{ color: "text.secondary" }}
          onClick={() => {
            props.openForm(true);
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
        <MenuItem sx={{ color: "text.secondary" }}  onClick={() => {
            handleDelete(props.data.Id);
          }}>
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
