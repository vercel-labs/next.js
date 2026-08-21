import { Form, Input, Button } from "antd";

export default function Home() {
  return (
    <Form name="demo">
      <Form.Item name={["user", "name"]} label="Name">
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">Submit</Button>
    </Form>
  );
}
