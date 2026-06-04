import { Box, Container, Divider, Paper, Typography } from "@mui/material";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "利用規約",
  description:
    "ガツガツグルメの利用規約です。当アプリをご利用いただく前に、本規約をよくお読みください。",
};

export default function TermsOfService() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, bgcolor: "transparent" }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          利用規約
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          この利用規約（以下、「本規約」といいます。）は、「ガツガツグルメ」（以下、「当アプリ」といいます。）の利用条件を定めるものです。ご利用の皆さま（以下、「ユーザー」といいます。）には、本規約に従って当アプリをご利用いただきます。
        </Typography>

        <Section title="第1条（適用）">
          <Typography variant="body2" paragraph>
            本規約は、ユーザーと当アプリの運営者との間の当アプリの利用に関わる一切の関係に適用されるものとします。
          </Typography>
          <Typography variant="body2" paragraph>
            当アプリに関して本規約のほか、ご利用にあたってのルール等、各種の定め（以下、「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず、本規約の一部を構成するものとします。
          </Typography>
        </Section>

        <Section title="第2条（サービス内容）">
          <Typography variant="body2" paragraph>
            当アプリは、駅周辺のラーメン、牛丼、定食などの飲食店情報を検索・表示するサービスです。
          </Typography>
          <Typography variant="body2" paragraph>
            当アプリは、Google Maps Platform
            APIを利用して店舗情報を提供しています。店舗情報の正確性については、Googleおよび各店舗の情報に依存しており、当アプリは情報の正確性を保証するものではありません。
          </Typography>
          <Typography variant="body2" paragraph>
            営業時間、定休日、メニュー内容、価格等は予告なく変更される場合がありますので、ご来店前に各店舗へ直接ご確認ください。
          </Typography>
        </Section>

        <Section title="第3条（禁止事項）">
          <Typography variant="body2" paragraph>
            ユーザーは、当アプリの利用にあたり、以下の行為をしてはなりません。
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              法令または公序良俗に違反する行為
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              犯罪行為に関連する行為
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              当アプリのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              当アプリの運営を妨害するおそれのある行為
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              他のユーザーに関する個人情報等を収集または蓄積する行為
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              他のユーザーに成りすます行為
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              当アプリに関連して、反社会的勢力に対して直接または間接に利益を供与する行為
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              当アプリのコンテンツを無断で複製、転載、改変する行為
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              その他、運営者が不適切と判断する行為
            </Typography>
          </Box>
        </Section>

        <Section title="第4条（当アプリの提供の停止等）">
          <Typography variant="body2" paragraph>
            運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく当アプリの全部または一部の提供を停止または中断することができるものとします。
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              当アプリにかかるシステムの保守点検または更新を行う場合
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              地震、落雷、火災、停電または天災などの不可抗力により、当アプリの提供が困難となった場合
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              システムまたは通信回線等が事故により停止した場合
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              その他、運営者が当アプリの提供が困難と判断した場合
            </Typography>
          </Box>
          <Typography variant="body2" paragraph>
            運営者は、当アプリの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。
          </Typography>
        </Section>

        <Section title="第5条（免責事項）">
          <Typography variant="body2" paragraph>
            運営者は、当アプリに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
          </Typography>
          <Typography variant="body2" paragraph>
            運営者は、当アプリに起因してユーザーに生じたあらゆる損害について、運営者の故意又は重過失による場合を除き、一切の責任を負いません。
          </Typography>
          <Typography variant="body2" paragraph>
            当アプリに掲載されている飲食店情報は、実際の店舗状況と異なる場合があります。店舗の営業状況、メニュー、価格等については、必ず各店舗に直接ご確認ください。
          </Typography>
        </Section>

        <Section title="第6条（サービス内容の変更等）">
          <Typography variant="body2" paragraph>
            運営者は、ユーザーへの事前の告知をもって、当アプリの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。
          </Typography>
        </Section>

        <Section title="第7条（利用規約の変更）">
          <Typography variant="body2" paragraph>
            運営者は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、当アプリの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
          </Typography>
        </Section>

        <Section title="第8条（個人情報の取扱い）">
          <Typography variant="body2" paragraph>
            当アプリの利用によって取得する個人情報については、当アプリの
            <Link
              href="/privacy"
              style={{ color: "#1976d2", textDecoration: "underline" }}
            >
              プライバシーポリシー
            </Link>
            に従い適切に取り扱うものとします。
          </Typography>
        </Section>

        <Section title="第9条（準拠法・裁判管轄）">
          <Typography variant="body2" paragraph>
            本規約の解釈にあたっては、日本法を準拠法とします。
          </Typography>
          <Typography variant="body2" paragraph>
            当アプリに関して紛争が生じた場合には、運営者の所在地を管轄する裁判所を専属的合意管轄とします。
          </Typography>
        </Section>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="caption" display="block" color="text.secondary">
            <strong>制定日：</strong>2025年12月24日
          </Typography>
          <Typography
            variant="caption"
            display="block"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            <strong>お問い合わせ：</strong>
            ryomasolid@yahoo.co.jp または
            <Link
              href="/contact"
              style={{
                color: "#1976d2",
                textDecoration: "underline",
                marginLeft: "4px",
              }}
            >
              お問い合わせフォーム
            </Link>
            よりご連絡ください。
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        component="h2"
        sx={{
          fontSize: "1.1rem",
          fontWeight: "bold",
          borderLeft: "4px solid #1976d2",
          pl: 1.5,
          mb: 2,
          lineHeight: 1.4,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}
