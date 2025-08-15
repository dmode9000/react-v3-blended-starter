// Library imports
import * as Yup from "yup";
import { Field, Form, Formik, FormikHelpers, ErrorMessage } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Services
import { createPost } from "../../services/postService";

// Styles
import css from "./CreatePostForm.module.css";

interface CreatePostValues {
  title: string;
  body: string;
}
const initialValues: CreatePostValues = { title: "", body: "" };

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Required")
    .min(3, "Title is too short(min 3)")
    .max(50, "Name is too long (max 50)"),
  body: Yup.string().max(500, "Content is too long (max 500)").required("Required"),
});

interface CreatePostProps {
  onClose: () => void;
}
export default function CreatePostForm({ onClose }: CreatePostProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created.");
      onClose();
    },
    onError(Error) {
      console.error("Erorr creating post:", Error);
    },
  });

  const handleSubmit = (values: CreatePostValues, actions: FormikHelpers<CreatePostValues>) => {
    console.log("PostForm data: ", values);
    mutate({ ...values, userId: 1 });
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
          <Field id="body" as="textarea" name="body" rows="8" className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={isPending}>
            {isPending ? "Creating..." : "Create post"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
