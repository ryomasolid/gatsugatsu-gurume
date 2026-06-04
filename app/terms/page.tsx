import { Box, Container, Divider, Paper, Typography, Stack } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
  description:
    "ガツガツグルメの利用規約です。当サービスをご利用いただく前に、本規約をよくお読みください。",
};

export default function TermsOfService() {
  const BRAND_COLOR = "#FF6B00";
  const DARK_COLOR = "#1A1A1A";

  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 8 },
          borderRadius: 8,
          border: `3px solid ${DARK_COLOR}`,
          boxShadow: `10px 10px 0px ${DARK_COLOR}`,
          bgcolor: "#fff",
        }}
      >
        <Stack spacing={4}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <DescriptionIcon sx={{ fontSize: "3rem", color: BRAND_COLOR, mb: 1 }} />
            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: "-0.02em" }}>
              利用規約
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: "#444", lineHeight: 1.8 }}>
            この利用規約（以下、「本規約」といいます。）は、ガツガツグルメ（以下、「当サービス」といいます。）の利用条件を定めるものです。ご利用の皆さま（以下、「ユーザー」といいます。）には、本規約に従って当サービスをご利用いただきます。
          </Typography>

          <Divider sx={{ borderBottomWidth: 2, borderColor: "#EEE" }} />

          <Section title="第1条（適用）" color={BRAND_COLOR}>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              本規約は、ユーザーと当サービスの運営者との間の当サービスの利用に関わる一切の関係に適用されるものとします。
            </Typography>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              当サービスに関して本規約のほか、ご利用にあたってのルール等、各種の定め（以下、「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず、本規約の一部を構成するものとします。
            </Typography>
          </Section>

          <Section title="第2条（サービス内容）" color={BRAND_COLOR}>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              当サービスは、駅周辺のラーメン、牛丼、定食などの飲食店情報を検索・表示するサービスです。
            </Typography>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              当サービスは、Google Maps Platform APIを利用して店舗情報を提供しています。店舗情報の正確性については、Googleおよび各店舗の情報に依存しており、当サービスは情報の正確性を保証するものではありません。
            </Typography>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              営業時間、定休日、メニュー内容、価格等は予告なく変更される場合がありますので、ご来店前に各店舗へ直接ご確認ください。
            </Typography>
          </Section>

          <Section title="第3条（禁止事項）" color={BRAND_COLOR}>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません。
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1, lineHeight: 1.8 }}>
                法令または公序良俗に違反する行為
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1, lineHeight: 1.8 }}>
                犯罪行為に関連する行為
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1, lineHeight: 1.8 }}>
                当サービスのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1, lineHeight: 1.8 }}>
                当サービスの運営を妨害するおそれのある行為
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1, lineHeight: 1.8 }}>
                他のユーザーに関する個人情報等を収集または蓄積する行為
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1, lineHeight: 1.8 }}>
                当サービスのコンテンツを無断で複製、転載、改変する行為
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1, lineHeight: 1.8 }}>
                その他、運営者が不適切と判断する行為
              </Typography>
            </Box>
          </Section>

          <Section title="第4条（当サービスの提供の停止等）" color={BRAND_COLOR}>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく当サービスの全部または一部の提供を停止または中断することができるものとします。
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1, lineHeight: 1.8 }}>
                当サービスにかかるシステムの保守点検または更新を行う場合
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1, lineHeight: 1.8 }}>
                地震、落雷、火災、停電または天災などの不可抗力により、当サービスの提供が困難となった場合
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1, lineHeight: 1.8 }}>
                システムまたは通信回線等が事故により停止した場合
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1, lineHeight: 1.8 }}>
                その他、運営者が当サービスの提供が困難と判断した場合
              </Typography>
            </Box>
          </Section>

          <Section title="第5条（免責事項）" color={BRAND_COLOR}>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              運営者は、当サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
            </Typography>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              運営者は、当サービスに起因してユーザーに生じたあらゆる損害について、運営者の故意又は重過失による場合を除き、一切の責任を負いません。
            </Typography>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              当サービスに掲載されている飲食店情報は、実際の店舗状況と異なる場合があります。店舗の営業状況、メニュー、価格等については、必ず各店舗に直接ご確認ください。
            </Typography>
          </Section>

          <Section title="第6条（サービス内容の変更等）" color={BRAND_COLOR}>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              運営者は、ユーザーへの事前の告知をもって、当サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。
            </Typography>
          </Section>

          <Section title="第7条（利用規約の変更）" color={BRAND_COLOR}>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              運営者は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、当サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
            </Typography>
          </Section>

          <Section title="第8条（個人情報の取扱い）" color={BRAND_COLOR}>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              当サービスの利用によって取得する個人情報については、当サービスの
              <Link
                href="/privacy"
                style={{ color: BRAND_COLOR, fontWeight: "bold", textDecoration: "underline" }}
              >
                プライバシーポリシー
              </Link>
              に従い適切に取り扱うものとします。
            </Typography>
          </Section>

          <Section title="第9条（準拠法・裁判管轄）" color={BRAND_COLOR}>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              本規約の解釈にあたっては、日本法を準拠法とします。
            </Typography>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              当サービスに関して紛争が生じた場合には、運営者の所在地を管轄する裁判所を専属的合意管轄とします。
            </Typography>
          </Section>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: "right" }}>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 700 }}>
              制定日：2025年12月24日
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 700, mt: 1 }}>
              ガツガツグルメ事務局
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}

function Section({
  title,
  children,
  color,
}: {
  title: string;
  children: React.ReactNode;
  color: string;
}) {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontSize: "1.2rem",
          fontWeight: 900,
          borderLeft: `6px solid ${color}`,
          pl: 2,
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
