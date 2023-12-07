import useSWR from "swr";
import Error from "next/error";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Row, Card, Col, Pagination } from "react-bootstrap";
import ArtworkCard from "@/components/ArtworkCard";
import validObjectIDList from "@/public/data/validObjectIDList.json";
const fetcher = (url) => fetch(url).then((res) => res.json());


export default function Artwork() {
  const PER_PAGE = 12;
  const [artworkList, setArtWorkList] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();
  let finalQuery = router.asPath.split("?")[1];
  let url = `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`;

  const { data, error } = useSWR(url, fetcher);

  function previousPage() {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }
  function nextPage() {
    if (page < artworkList.length) {
      setPage((prev) => prev + 1);
    }
  }
  useEffect(() => {
    if (data) {
      var results = [];
      let filteredResults = validObjectIDList.objectIDs.filter((x) =>
        data.objectIDs?.includes(x)
      );

      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
      setArtWorkList(results);
    }
    setPage(1);
  }, [data]);
  if (error) {
    return <Error statusCode={404} />;
  }
  if (artworkList) {
    return (
      <>
        <Row className="gy-4">
          {artworkList.length > 0 ? (
            artworkList[page - 1].map((currentObjectID) => (
              <Col lg={3} key={currentObjectID}>
                <ArtworkCard objectID={currentObjectID} />
              </Col>
            ))
          ) : (
            <Card>
              <Card.Body>
                <Card.Text>
                  <h4>Nothing Here</h4>
                  Try searching for something else.
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </Row>
        <br />
        {artworkList.length > 0 && (
          <Row>
            <Col>
              <Pagination>
                <Pagination.Prev
                  onClick={(e) => {
                    previousPage(e);
                  }}
                />
                <Pagination.Item>{page}</Pagination.Item>
                <Pagination.Next
                  onClick={(e) => {
                    nextPage(e);
                  }}
                />
              </Pagination>
            </Col>
          </Row>
        )}
      </>
    );
  } else return null;
}
