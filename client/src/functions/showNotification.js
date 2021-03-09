import { notification } from "antd"

export const showNotification = ({ message, description, type = "info" }) => {
    notification[type]({
        message,
        description,
        placement: "bottomRight",
        style: {
            backgroundColor: 'lightblue',
            borderRadius: "10px"
        }
    });
}