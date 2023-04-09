import useSWR from "swr";
import Error from "next/error";
import Card from "react-bootstrap/Card";
import { favouritesAtom } from "@/store";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { addToFavourites, removeFromFavourites } from "@/lib/userData";
// const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ArtworkCardDetail(props) {
  const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects`;

  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);
  useEffect(() => {
    setShowAdded(favouritesList?.includes(props.objectID));
  }, [favouritesList]);

  async function favouriteClicked() {
    if (showAdded == true) {
      setFavouritesList(await removeFromFavourites(props.objectID));
      setShowAdded(false);
    } else {
      setFavouritesList(await addToFavourites(props.objectID));
      setShowAdded(true);
    }
  }

  // const { data, error } = useSWR(url, fetcher);
  const { data, error } = useSWR(
    props.objectID ? `${url}/${props.objectID}` : null
  );
  if (error) {
    return <Error statusCode={404} />;
  }
  if (data) {
    return (
      <>
        <Card>
          {data?.primaryImage && (
            <Card.Img variant="top" src={data?.primaryImage} />
          )}
          <Card.Body>
            <Card.Title>{data?.title}</Card.Title>
            <Card.Text>
              <strong>Date: </strong>
              {data?.objectDate ? data.objectDate : "N/A"} <br />
              <strong>Classification: </strong>
              {data?.classification ? data?.classification : "N/A"}
              <br />
              <strong>Medium: </strong>
              {data?.medium ? data?.medium : "N/A"}
              <br />
              <br />
              <strong>Artist: </strong>
              {data?.artistDisplayName ? (
                <span>
                  {data.artistDisplayName}
                  {data.artistWikidata_URL ? (
                    <span>
                      {" ( "}
                      <a
                        href={data.artistWikidata_URL}
                        target="_blank"
                        rel="noreferrer">
                        wiki
                      </a>
                      {" )"}
                    </span>
                  ) : null}
                </span>
              ) : (
                "N/A"
              )}
              <br />
              <strong>Credit Line: </strong>
              {data?.creditLine ? data?.creditLine : "N/A"}
              <br />
              <strong>Dimensions: </strong>
              {data?.dimensions ? data?.dimensions : "N/A"}
              &nbsp; &nbsp;
              <br />
              <br />
              <Button
                variant={showAdded == true ? "primary" : "outline-primary"}
                onClick={favouriteClicked}>
                {showAdded == true ? "+ Favourite (added)" : "+ Favourite"}
              </Button>
            </Card.Text>
          </Card.Body>
        </Card>
      </>
    );
  } else return null;
}
