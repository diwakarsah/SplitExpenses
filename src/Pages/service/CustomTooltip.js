
import {withStyles} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import {green} from "@material-ui/core/colors";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import React from "react";

//styling tool tip
export const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: '#267c39',
        color: 'white',
        boxShadow: theme.shadows[1],
        fontSize: 12,
    },
}))(Tooltip);

export const RedTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: 'red',
        color: 'white',
        boxShadow: theme.shadows[1],
        fontSize: 12,
    },
}))(Tooltip);

export const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);
