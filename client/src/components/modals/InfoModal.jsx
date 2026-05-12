import { useEffect, useState } from "react";
import PubSub from "../../common/PubSub";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const InfoModal = () => {
    const [translate] = useTranslation();
    const [show, setShow] = useState(false);
    const [header, setHeader] = useState("");
    const [text, setText] = useState("");

    useEffect(() => {
        const subscription = PubSub.subscribe("show_info", ({ header = "", text = "" }) => {
            setHeader(translate(header));
            setText((translate(text)));
            setShow(true);
        });

        return () => {
            PubSub.unsubscribe("show_info", subscription);
        }
    });

    return <Modal
        size="md"
        show={show}
        backdrop="static"
    >
        <Modal.Header>
            <span>
                {header}
            </span>
        </Modal.Header>

        <Modal.Body>
            <span className="fs-5">
                {text}
            </span>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="dark" onClick={() => { setShow(false) }}>
                {translate("common.close")}
            </Button>
        </Modal.Footer>
    </Modal>

}

export default InfoModal;