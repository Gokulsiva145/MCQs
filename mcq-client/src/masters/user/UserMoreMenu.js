import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import editFill from "@iconify/icons-eva/edit-fill";
import { Link as RouterLink } from "react-router-dom";
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
import Swal from "sweetalert2";
// ----------------------------------------------------------------------

export default function UserMoreMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (userId) => {
    fetch(`http://localhost:5000/users/${userId}`, {
      method: "delete",
    }).then(() => {
      setIsOpen(false);
      props.onAfterDelete();
    });
  };

  const handleUpdate = (data) => {
    fetch("http://localhost:5000/users/edit", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.passCode,
        userType: data.user_Type_Id,
        statusCode: data.status_Code === 0 ? 1 : 0,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result[0] === 1) {
          setIsOpen(false);
          props.onAfterUpdate();
        }
      })
      .catch((err) => {
        console.log(err);
        // throw err;
      });
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
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
          onClick={() => handleUpdate(props.data)}
        >
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Toggle Status"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
        <MenuItem
          sx={{ color: "text.secondary" }}
          onClick={() => {
            handleDelete(props.data.userId);
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
