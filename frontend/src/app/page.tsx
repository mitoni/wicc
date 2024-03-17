"use client";

import {
  Button,
  Flex,
  Grid,
  Select,
  Text,
  Textarea,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import React from "react";
import Markdown from "react-markdown";
import Lottie from "lottie-react";
import imageLoadingAnimation from "../assets/animations/image-loading.json";
import Ads from "@/components/Ads";
// import testResponse from "../assets/test-response";
import Donate from "@/components/Donate";

const ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "http://wicc.app:8080"
    : "http://localhost:8080";

export default function Home() {
  const [ingredients, setIngredients] = React.useState<string>("");
  const [recipes, setRecipes] = React.useState<
    { title: string; body: string }[]
  >([]);
  const [images, setImages] = React.useState<Record<string, string>>({});
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const theme = useMantineTheme();

  /* Find the user time and guess what they are cooking for */
  const defaultMeal = React.useMemo(() => {
    const hour = new Date().getHours();
    const meals = ["breakfast", "lunch", "dinner"];
    const times = [8, 13, 20];
    const diffs = times.map((time) => time - hour);

    const index =
      hour >= times[times.length - 1]
        ? times.length - 1
        : diffs.findIndex((time) => time > 0);

    const meal = meals[index];

    return meal;
  }, []);

  const form = useForm({
    initialValues: {
      ingredients: "",
      usage: "including",
      meal: defaultMeal,
    },
    onValuesChange: (values) => {
      setIngredients(values.ingredients);
    },
  });

  React.useEffect(() => {
    for (let recipe of recipes) {
      const body = JSON.stringify({ title: recipe.title });
      fetch(ENDPOINT + "/image/", {
        method: "POST",
        body,
      }).then(async (res) => {
        const text = await res.text();
        setImages((prev) => {
          return { ...prev, [recipe.title]: text };
        });
      });
    }
  }, [recipes]);

  async function handleSubmit(values: typeof form.values) {
    // async function wait() {
    //   return new Promise((resolve) => setTimeout(resolve, 1000));
    // }

    try {
      setLoading(true);
      setError(null);
      setRecipes([]);

      const body = JSON.stringify(values);
      const res = await fetch(ENDPOINT + "/recipes/", {
        method: "POST",
        body,
      });

      const text = await res.text();

      // await wait();
      //
      // const text = testResponse;

      // Split response on h2
      const _recipes = text.split(/(?=##)/);
      const recipes = await Promise.all(
        _recipes.map(async (recipe) => {
          // Get the title
          let title = recipe.split(/\n/)[0];
          title = title.replace("##", "");

          return {
            title,
            body: recipe,
          };
        }),
      );

      if (recipes.length < 2) {
        throw recipes[0]?.body;
      }

      setRecipes(recipes);

      // Initialize images object
      const images: Record<string, string> = {};
      for (let recipe of recipes) {
        images[recipe.title] = "";
      }

      setImages(images);
    } catch (error) {
      const defaultError =
        "Something went wrong and I have no idea why 🙃 Please try again later.";
      setError(String(error) ?? defaultError);
    } finally {
      setLoading(false);
    }
  }

  const getFoodIcon = React.useCallback(() => {
    const icons = [
      "🍳",
      "🥞",
      "🧇",
      "🌭",
      "🍔",
      "🍕",
      "🥪",
      "🥙",
      "🌮",
      "🌯",
      "🥗",
      "🥘",
      "🍝",
      "🍜",
      "🍲",
      "🍛",
      "🍣",
      "🍙",
      "🥠",
      "🥧",
      "🍰",
      "🎂",
    ];
    const index = Math.round(Math.random() * icons.length);
    return icons[index];
  }, []);

  return (
    <main style={{ maxWidth: "100vw", minHeight: "100vh" }}>
      <section style={{ margin: "0 auto", maxWidth: 1024, padding: "0 1rem" }}>
        <img
          style={{
            position: "absolute",
            mixBlendMode: "multiply",
            left: 0,
            top: 0,
            height: "80vh",
            objectFit: "contain",
            transform: "translateX(-40%) rotate(180deg)",
            zIndex: -1,
          }}
          src="/pan_5.jpg"
        />

        <img
          style={{
            position: "absolute",
            mixBlendMode: "multiply",
            right: 0,
            top: "33.33vh",
            height: "100vh",
            objectFit: "contain",
            transform: "translateX(40%) rotate(-45deg)",
            zIndex: -1,
          }}
          src="/ing_3.jpg"
        />

        <Flex
          direction={"column"}
          justify={"center"}
          align={"center"}
          pt={"6rem"}
          pb={theme.spacing.lg}
          style={{ zIndex: 19 }}
        >
          <Title order={1}>What I Can Cook...</Title>

          <div>
            <span>with </span>
            <span>{ingredients}</span>
          </div>
        </Flex>

        <Form form={form} onSubmit={handleSubmit}>
          <Grid>
            <Grid.Col span={4}>
              <Flex
                h={"100%"}
                justify={"end"}
                align={"start"}
                bg={"#ebedeecc"}
                style={{ borderRadius: "0.66rem" }}
              >
                I have
              </Flex>
            </Grid.Col>

            <Grid.Col span={8}>
              <Textarea
                style={{ margin: "auto" }}
                w={"100%"}
                placeholder="tomatoes, mozzarella, basil and bread"
                {...form.getInputProps("ingredients")}
              />
            </Grid.Col>

            <Grid.Col span={4} ta={"right"}>
              <Flex
                h={"100%"}
                justify={"end"}
                align={"center"}
                bg={"#ebedeecc"}
                style={{ borderRadius: "0.66rem" }}
              >
                and I want a recipe
              </Flex>
            </Grid.Col>

            <Grid.Col span={4}>
              <Select
                allowDeselect={false}
                w={"100%"}
                defaultValue="including"
                data={[
                  { label: "Using only", value: "using only" },
                  { label: "Including", value: "including" },
                ]}
                {...form.getInputProps("usage")}
              />
            </Grid.Col>

            <Grid.Col span={4} ta={"left"} style={{ verticalAlign: "middle" }}>
              <Flex
                h={"100%"}
                justify={"start"}
                align={"center"}
                bg={"#ebedeecc"}
                style={{ borderRadius: "0.66rem" }}
              >
                those ingredients
              </Flex>
            </Grid.Col>

            <Grid.Col span={4} ta={"right"}>
              <Flex
                h={"100%"}
                justify={"end"}
                align={"center"}
                bg={"#ebedeecc"}
                style={{ borderRadius: "0.66rem" }}
              >
                to prepare for
              </Flex>
            </Grid.Col>

            <Grid.Col span={4}>
              <Select
                allowDeselect={false}
                w={"100%"}
                defaultValue={defaultMeal}
                data={[
                  { label: "Breakfast", value: "breakfast" },
                  { label: "Lunch", value: "lunch" },
                  { label: "Dinner", value: "dinner" },
                  { label: "Snack", value: "snack" },
                ]}
                {...form.getInputProps("meal")}
              />
            </Grid.Col>

            <Grid.Col span={12} ta={"center"}>
              <Button
                type="submit"
                radius={99}
                loading={isLoading}
                disabled={!form.values.ingredients.length}
              >
                What can I cook?
              </Button>
            </Grid.Col>
          </Grid>
        </Form>

        <Flex mt={theme.spacing.lg} mb={theme.spacing.me}>
          <Text w={"100%"} c={theme.colors.gray[6]} ta={"center"}>
            I hope this turns you into a food-saving superhero! 🌎💪 No crumb
            left behind!
          </Text>
        </Flex>

        {recipes.length || error ? null : (
          <Ads style={{ margin: `${theme.spacing.lg} 0` }} slot="2402485177" />
        )}

        <Flex direction={"column"}>
          {error ? (
            <Flex justify={"center"} align={"center"} mt={theme.spacing.lg}>
              {error}
            </Flex>
          ) : (
            recipes?.map((recipe, index) => (
              <Flex key={index} direction={"column"} mt={theme.spacing.lg}>
                <Grid>
                  <Grid.Col span={10}>
                    <Markdown key={index}>{recipe.body}</Markdown>
                  </Grid.Col>

                  <Grid.Col span={2}>
                    <Flex
                      h={"100%"}
                      direction={"column"}
                      justify={"center"}
                      align={"center"}
                    >
                      {images[recipe.title] ? (
                        <a
                          href={`https://www.google.com/search?q=${recipe.title} Recipe`}
                          target="_blank"
                        >
                          <img
                            style={{
                              width: "100%",
                              borderRadius: "0.66rem",
                              border: "1px solid #d3d5d6",
                              boxShadow: "0 0 30px #0000001a",
                            }}
                            src={images[recipe.title]}
                          />
                        </a>
                      ) : (
                        <Lottie animationData={imageLoadingAnimation} />
                      )}
                    </Flex>
                  </Grid.Col>
                </Grid>

                <Flex w={"100%"} justify={"start"} align={"center"}>
                  <a
                    href={`https://www.google.com/search?q=${recipe.title} Recipe`}
                    target="_blank"
                  >
                    <Button radius={99}>Search on Google</Button>
                  </a>
                </Flex>

                <Ads
                  style={{ margin: `${theme.spacing.lg} 0` }}
                  slot="4842560659"
                />

                {index !== recipes.length - 1 ? (
                  <Flex w={"100%"} justify={"center"}>
                    {getFoodIcon()}
                  </Flex>
                ) : null}
              </Flex>
            ))
          )}
        </Flex>

        <Flex
          mt={theme.spacing.lg}
          pt={theme.spacing.lg}
          mb={theme.spacing.lg}
          c={theme.colors.gray[6]}
          style={{ borderTop: `1px solid ${theme.colors.gray[3]}` }}
          direction={"column"}
          align={"center"}
          gap={theme.spacing.sm}
        >
          <Text>
            Made with love for the planet 🌱 by{" "}
            <a href={"https://www.mitonizzo.com"} target="_blank">
              mito
            </a>
          </Text>

          <Donate />
        </Flex>
      </section>
    </main>
  );
}
