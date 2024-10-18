import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchBestSellingWines } from "./api";
import { BestSellingWine } from "./types";

const Container = styled.div`
  padding: 10px 40px;
`;

const HeaderText = styled.h1`
  margin: 0;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media only screen and (max-width: 1100px) {
    flex-direction: column;
    div {
      margin: 0 0 25px 0;
    }
  }
`;

const Separator = styled.hr`
  background: black;
  height: 1.2px;
  margin: 10px 0 30px 0;
`;

const SearchContainer = styled.div`
  border: 2px solid black;
  border-radius: 25px;
  width: 400px;
  display: flex;
  padding: 2px 0;

  input {
    height: 32px;
    width: 100%;
    outline: none;
    margin: 0 15px;
    border: none;
    font-size: 14px;
  }
`;

const NavContainer = styled.div`
  width: fit-content;
  display: flex;
  gap: 10px;
`;

const NavItem = styled.button<{ active?: boolean }>`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: 2px solid black;
  padding: 0 12px;
  cursor: pointer;
  background: ${(props) => (props.active ? "#e0e0e0" : "none")};

  &:hover {
    background: #f0f0f0;
  }
`;

const BodyContainer = styled.ul`
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ListItem = styled.li<{ isTopTen?: boolean; isBottomTen?: boolean }>`
  height: 40px;
  border: 2px solid black;
  list-style: none;
  display: flex;
  align-items: center;
  padding: 0 15px;
  background: ${(props) =>
    props.isTopTen ? "#e6ffe6" : props.isBottomTen ? "#ffe6e6" : "white"};
`;

const MetricValue = styled.span`
  margin-left: auto;
  font-weight: 500;
`;

const App = () => {
  const [wines, setWines] = useState<BestSellingWine[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [metric, setMetric] = useState<"revenue" | "bottles" | "orders">(
    "revenue"
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredWines = wines.filter(
    (wine: BestSellingWine) =>
      wine?.name?.toLowerCase().includes(searchTerm) ||
      (wine.vintage?.toString() || "").includes(searchTerm)
  );

  useEffect(() => {
    const loadWines = async () => {
      const response = await fetchBestSellingWines(metric);
      setWines(response.wines);
    };

    loadWines();
  }, [metric]);

  const formatMetricValue = (wine: BestSellingWine) => {
    switch (metric) {
      case "revenue":
        return wine.revenue.toLocaleString("en-UK", {
          style: "currency",
          currency: "GBP",
        });
      case "bottles":
        return `${wine.bottlesSold.toLocaleString()} bottles`;
      case "orders":
        return `${wine.orderCount.toLocaleString()} orders`;
    }
  };

  return (
    <Container>
      <HeaderContainer>
        <HeaderText>Best Selling Wines</HeaderText>
        <SearchContainer>
          <input
            type="text"
            placeholder="Search wines..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </SearchContainer>
        <NavContainer>
          <NavItem
            active={metric === "revenue"}
            onClick={() => setMetric("revenue")}
          >
            By Revenue
          </NavItem>
          <NavItem
            active={metric === "bottles"}
            onClick={() => setMetric("bottles")}
          >
            By # bottles sold
          </NavItem>
          <NavItem
            active={metric === "orders"}
            onClick={() => setMetric("orders")}
          >
            By # orders
          </NavItem>
        </NavContainer>
      </HeaderContainer>
      <Separator />
      <BodyContainer>
        {filteredWines?.map((wine: BestSellingWine) => (
          <ListItem
            key={wine.id}
            isTopTen={wine.isTopTen}
            isBottomTen={wine.isBottomTen}
          >
            <span>#{wine.position}</span>
            <span style={{ marginLeft: "15px" }}>
              {wine.name} - {wine.vintage || "N/A"}
            </span>
            <MetricValue>{formatMetricValue(wine)}</MetricValue>
          </ListItem>
        ))}
      </BodyContainer>
    </Container>
  );
};

export default App;
