import Layout from "@/layouts/Layout";
import GenericTable from "@/components/common/GenericTable";
import { Column } from "@/types/common/generic-table";
import { Mail, MailTable } from "@/types/mail";

const MailList = () => {
  const allMailList: Mail[] = [
    {
      created_at: "2021-01-01 10:00:00",
      posted_member: "山田太郎、山田花子、鈴木一郎",
      title: "テストメール1",
      message: "こんにちは1",
    },
    {
      created_at: "2021-01-01 11:00:00",
      posted_member: "山田太郎、山田花子、鈴木一郎",
      title: "テストメール2",
      message: "こんにちは2",
    },
    {
      created_at: "2021-01-01 11:00:00",
      posted_member: "山田太郎、山田花子、鈴木一郎",
      title: "テストメール3",
      message: "こんにちは3",
    },
  ];

  const columns: Column<MailTable>[] = [
    { header: "メール送信日時", accessor: "created_at" },
    { header: "送信先", accessor: "posted_member" },
    { header: "メールタイトル", accessor: "title" },
  ];

  const allMailTableList: MailTable[] = allMailList.map((mail) => ({
    created_at: mail.created_at,
    posted_member: mail.posted_member,
    title: mail.title,
  }));

  const handleRowClick = (row: MailTable) => {
    // クリックされた行のメール情報を取得
    const mail = allMailList.find(
      (m) => m.created_at === row.created_at && m.title === row.title
    );
    if (mail) {
      console.log("メールの詳細:", mail);
    }
  };

  return (
    <Layout>
      <GenericTable
        columns={columns}
        data={allMailTableList}
        onRowClick={handleRowClick}
      />
    </Layout>
  );
};

export default MailList;
