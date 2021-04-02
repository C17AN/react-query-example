import React from "react";
import axios from "axios";

import { useQuery, useMutation, queryCache } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";

export default () => {
  const [text, setText] = React.useState("");
  const { status, data, error, isFetching } = useQuery("todos", async () => {
    const { data } = await axios.get("/api/data");
    return data;
  });

  const [mutatePostTodo] = useMutation(
    (text) => axios.post("/api/data", { text }),
    {
      onSuccess: () => {
        // 쿼리 무효화(Query Invalidations)
        // queryCache.invalidateQueries('todos')
        setText("");
      },
    }
  );

  return (
    <div>
      <p>
        새로운 항목을 추가할 때, useMutation 훅이 비동기 함수의 실행 결과를
        관측할 것입니다.
        <br />
        요청에 성공한 후 이전 쿼리를 무효화(invalidate)할 수도 있으며, React
        Query는 동일한 키로 쿼리를 다시 불러옵니다.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutatePostTodo(text);
        }}
      >
        <input
          type="text"
          onChange={(event) => setText(event.target.value)}
          value={text}
        />
        <button>Create</button>
      </form>
      <br />
      {status === "loading" ? (
        "Loading..."
      ) : status === "error" ? (
        error.message
      ) : (
        <>
          <div>Updated At: {new Date(data.ts).toLocaleTimeString()}</div>
          <ul>
            {data.items.map((datum) => (
              <li key={datum}>{datum}</li>
            ))}
          </ul>
          <div>{isFetching ? "백그라운드에서 업데이트 중..." : " "}</div>
        </>
      )}
      <ReactQueryDevtools initialIsOpen />
    </div>
  );
};
