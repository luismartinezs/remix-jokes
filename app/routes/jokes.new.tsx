import { json, type ActionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const content = formData.get("content");

  const errors = {
    name: name ? null : "Name is required",
    content: content ? null : "Content is required",
  };

  const hasErrors = Object.values(errors).some(Boolean);

  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof name === "string", "Name should be a string");
  invariant(typeof content === "string", "Content should be a string");

  const joke = await db.joke.create({
    data: { name, content },
  });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  const errors = useActionData<typeof action>();

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <Form method="post">
        <div>
          <label>
            Name: {errors?.name ?? <span>Name is required</span>}
            <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label>
            Content: {errors?.content ?? <span>Content is required</span>}
            <textarea name="content" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </Form>
    </div>
  );
}
