import { searchHistoryAtom } from "@/store";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import React from "react";
import { Button, Card, ListGroup, Row } from "react-bootstrap";
import styles from "@/styles/History.module.css";
import { removeFromHistory } from "@/lib/userData";

export default function History() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  let parsedHistory = [];

  searchHistory.forEach((h) => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });
  const router = useRouter();
  if (!searchHistory) return null;
  function historyClicked(e, index) {
    router.push(`artwork?${[searchHistory[index]]}`);
  }
  async function removeHistoryClicked(e, index) {
    e.stopPropagation();
    /*setSearchHistory((current) => {
    //   let x = [...current];
    //   x.splice(index, 1);
    //   return x;
    // });*/
    setSearchHistory(await removeFromHistory(searchHistory[index]));
  }
  console.log(parsedHistory);
  return (
    <>
      <br />
      <Row className="gy-4">
        {parsedHistory.length > 0 ? (
          <ListGroup>
            {parsedHistory.map((data, index) => (
              <ListGroup.Item onClick={(e) => historyClicked(e, index)}>
                {Object.keys(data).map((key) => (
                  <>
                    {key}: <strong>{data[key]}</strong>&nbsp;
                  </>
                ))}
                <Button
                  className="float-end"
                  variant="danger"
                  size="sm"
                  onClick={(e) => removeHistoryClicked(e, index)}>
                  &times;
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <Card>
            &nbsp;
            <h4>Nothing Here</h4>
            <p>Try searching for some artwork.</p>
          </Card>
        )}
      </Row>
      <br />
    </>
  );
}
