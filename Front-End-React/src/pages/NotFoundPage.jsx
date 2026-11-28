import { Link } from "react-router";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";

const NotFoundPage = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="5"
      style={{
        minHeight: "75vh",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <FileQuestion
        size={80}
        strokeWidth={1.2}
        style={{ color: "var(--accent-9)" }}
      />

      <Heading
        style={{
          fontSize: "100px",
          color: "var(--accent-9)",
        }}
      >
        404
      </Heading>

      <Heading size="7">Page Not Found</Heading>

      <Text color="gray" size="3">
        The page you are looking for does not exist or may have been moved.
      </Text>

      <Flex gap="3" wrap="wrap" justify="center">
        <Button size="3" variant="soft" onClick={() => window.history.back()}>
          <ArrowLeft size={18} />
          Go Back
        </Button>

        <Button size="3" asChild>
          <Link to="/" replace>
            <Home size={18} />
            Back to Home
          </Link>
        </Button>
      </Flex>
    </Flex>
  );
};

export default NotFoundPage;
