import { useForm } from 'react-hook-form';
import { useMutation, gql } from '@apollo/client'
const UPLOAD = gql`
    mutation uploadFile($file: Upload!) {
      uploadFile(file: $file) {
        uri
      }
    }

`
const Upload = () => {
  const { register, handleSubmit } = useForm()
  const [uploadF] = useMutation(UPLOAD, { onCompleted: (data) => console.log('done', data) })
  const onSubmit = (data) => {
    console.log(data.transactionCsv[0])
    uploadF({ variables: { file: data.transactionCsv[0] } })
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input ref={register} type="file" name="transactionCsv" accept=".csv" />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Upload;
