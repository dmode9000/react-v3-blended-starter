// Library imports
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Services
import { editPost } from "../../services/postService";

// Types
import type { Post } from "../../types/post";

// Styles
import css from "./EditPostForm.module.css";

interface EditPostValues {
  title: string;
  body: string;
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Required")
    .min(3, "Title is too short(min 3)")
    .max(50, "Name is too long (max 50)"),
  body: Yup.string().max(500, "Content is too long (max 500)").required("Required"),
});

interface EditPostProps {
  id: Post["id"];
  oldTitle: Post["title"];
  oldBody: Post["body"];
  onCansel: () => void;
}

export default function EditPostForm({ onCansel, oldTitle, oldBody, id }: EditPostProps) {
  const initialValues = { title: oldTitle, body: oldBody };
  const queryClient = useQueryClient();

  // Тип для даних, що передаються в mutate
  interface EditPostPayload {
    id: Post["id"];
    values: EditPostValues;
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: EditPostPayload) => editPost(payload.id, payload.values),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post edited.");
      onCansel();
    },
    onError(Error) {
      console.error("Erorr editing post:", Error);
    },
  });

  const handleSubmit = (values: EditPostValues, actions: FormikHelpers<EditPostValues>) => {
    console.log("PostForm data: ", values);
    mutate({ id, values });
    actions.resetForm();
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows={8} className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCansel}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={isPending}>
            Edit post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
