import React, { useState, useEffect } from "react";
import { Box, Button, Center, Container, Heading, Text, useToast } from "@chakra-ui/react";
import { FaStopwatch } from "react-icons/fa";

const Index = () => {
  const [gameState, setGameState] = useState("waiting"); // 'waiting', 'ready', 'click'
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const toast = useToast();

  useEffect(() => {
    let timer;

    if (gameState === "ready") {
      // Set a random timer to change state to 'click'
      const timeToWait = Math.floor(Math.random() * 5000) + 2000; // 2 to 7 seconds
      timer = setTimeout(() => {
        setGameState("click");
        setStartTime(Date.now());
      }, timeToWait);
    }

    // Clean up the timer on unmount or gameState change
    return () => clearTimeout(timer);
  }, [gameState]);

  const handleReactionClick = () => {
    if (gameState === "waiting") {
      // Game started, prepare for the player to react
      setGameState("ready");
      toast({
        title: "Get ready!",
        description: "Wait for the color to change, then click!",
        status: "info",
        duration: 2000,
      });
    } else if (gameState === "ready") {
      // Too soon! Reset and let the player know they clicked too early
      toast({
        title: "Too soon!",
        description: "You clicked too early. Wait for the color to change!",
        status: "error",
        duration: 3000,
      });
      setGameState("waiting");
    } else if (gameState === "click") {
      // Reaction time measured
      setEndTime(Date.now());
      setGameState("waiting");
    }
  };

  const renderButton = () => {
    let bgColor;
    let text;

    switch (gameState) {
      case "waiting":
        bgColor = "tomato";
        text = "Click to start";
        break;
      case "ready":
        bgColor = "gray";
        text = "Wait for green...";
        break;
      case "click":
        bgColor = "green";
        text = "Click!";
        break;
      default:
        bgColor = "tomato";
        text = "Click to start";
    }

    return (
      <Button colorScheme="teal" bg={bgColor} onClick={handleReactionClick} size="lg" leftIcon={<FaStopwatch />}>
        {text}
      </Button>
    );
  };

  const renderResult = () => {
    if (gameState === "waiting" && endTime > 0) {
      const reactionTime = endTime - startTime;
      return (
        <Text fontSize="lg" mt={4}>
          Your reaction time: {reactionTime} ms
        </Text>
      );
    }
    return null;
  };

  return (
    <Container>
      <Center height="100vh" flexDirection="column">
        <Heading mb={4}>Reaction Time Test</Heading>
        <Text fontSize="md">Test your reaction speed!</Text>
        {renderButton()}
        {renderResult()}
      </Center>
    </Container>
  );
};

export default Index;
