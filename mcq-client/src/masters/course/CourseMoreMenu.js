import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
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

export default function CourseMoreMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async (courseCode) => {
    setIsOpen(false);
    await fetch(`http://localhost:5000/courses/${courseCode}`, {
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
            handleDelete(props.data.courseCode);
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
