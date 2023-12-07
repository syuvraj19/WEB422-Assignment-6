import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import ArtworkCardDetail from "@/components/ArtworkCardDetail";
import { useRouter } from "next/router";

export default function ObjectID() {
  const router = useRouter();
  const { objectID } = router.query;
  return (
    <Row>
      <Col>
        <ArtworkCardDetail objectID={objectID} />
      </Col>
    </Row>
  );
}
