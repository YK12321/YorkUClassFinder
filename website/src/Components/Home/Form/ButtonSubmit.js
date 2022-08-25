import {Avatar, Button, Dialog, ListItem, ListItemAvatar, ListItemText, Modal} from "@mui/material";
import {declareState} from "../../../Tools/Toolbox";
import DeclaredComponent from "../../../Tools/DeclaredComponent";
import styled from "styled-components";
import DialogTitle from "@mui/material/DialogTitle";
import {buildAppleMapsQuery, buildGoogleMapsQuery, buildOSMQuery, buildWazeQuery} from "../../../Tools/MapQueries";

const ModalBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 400px;
  max-height: 380px;
  box-shadow: 0 3px 24px rgb(0 0 0 / 0.3);;
  background-color: white;
  border: 4px solid rgba(255, 255, 255, 0.8);
  padding-bottom: 13px;
`;

const ProviderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: transparent;
`;

class ButtonSubmit extends DeclaredComponent {

    providers = [
        {
            "label": "Class Find Tool",
            "key": "osm",
            "image": "/logo512.png",
            "generator": buildOSMQuery
        },
        {
            "label": "Google Maps",
            "key": "gmaps",
            "image": "/foreign/gmaps.png",
            "generator": buildGoogleMapsQuery
        },
        {
            "label": "Apple Maps",
            "key": "apple",
            "image": "/foreign/apple.png",  // http://maps.apple.com/?ll=22,23&z=20&q=Banana+Cheeks
            "generator": buildAppleMapsQuery
        },
        {
            "label": "Waze",
            "key": "waze",
            "image": "/foreign/waze.png",
            "generator": buildWazeQuery
        }
    ]

    roomNotFound = {
        "title": "Cannot Get Directions",
        "body": (
            <p>
                This class does not meet in person today. Google Maps directions are only available for classes that
                have a scheduled, in-person meeting time.
            </p>
        )
    }

    failedOpenMap = {
        "title": "Failed to Open Map",
        "body": (
            <p>
                Failed to open map. This is an internal error. Create an issue on the GitHub page
                so that we may look into and solve this issue.
            </p>
        )
    }

    constructor(props) {
        super(props);
        this.first = true;
        this.state = {
            course: null,
            section: null,
            class: null,
            day: null,
            building_codes: {},
            open: false,
            mapCoords: {}
        }
    }

    onDeclareState(stateChange, stateKeys) {
        let states = Object.keys(this.state);

        for (let key of stateKeys) {
            if (states.includes(key)) {
                let changeList = {};
                changeList[key] = stateChange[key]
                this.setState(changeList);
                break;
            }
        }
    }

    isDisabled() {
        return !(this.state.class && this.state.course && this.state.section && this.state.day);
    }

    handleModalSelect(self, result) {

        // Cancelled or Invalid
        if (result == null) {
            this.setState({open: false});
            return;
        } else setTimeout(() => this.setState({open: false}), 200);

        // Actions depending on selection
        let url = result.generator(this.state);

        // Open
        if (url) window.open(url);
        else declareState({errorModal: this.failedOpenMap});

    }

    getModal() {
        return (

            <Modal onClose={() => this.handleModalSelect(this, null)} open={this.state.open}>
                <ModalBox>
                    <DialogTitle>Select Maps Provider</DialogTitle>
                    <div>
                        {this.providers.map((provider) => (
                            <ListItem button onClick={() => this.handleModalSelect(this, provider)} key={provider.key}>
                                <ListItemAvatar>
                                    <Avatar style={{borderRadius: "0px", backgroundColor: "transparent"}}>
                                        <ProviderImage src={provider.image} />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText style={{marginLeft: "-5"}} primary={provider.label} />
                            </ListItem>
                        ))}
                    </div>
                </ModalBox>
            </Modal>
        )
    }

    render() {

        let valid = buildGoogleMapsQuery(this.state);

        return (
            <div>
                {this.getModal()}
                <Button
                    disabled={this.isDisabled()}
                    variant="contained"
                    onClick={() => valid ? this.setState({open: true}) : declareState({errorModal: this.roomNotFound})}
                    style={{...this.props.style, ...{"width": "100%"}}}>Get Detailed Directions
                </Button>
            </div>
        )
    }

}

export default ButtonSubmit;
