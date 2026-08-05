import { Box, Container, Typography, Stack, Paper, Divider } from "@mui/material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import StarsIcon from "@mui/icons-material/Stars";
import InfoIcon from "@mui/icons-material/Info";
import { SITE_OPERATOR } from "@/constants/siteOperator";
import EditorProfile from "@/components/EditorProfile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ガツガツグルメとは",
  description:
    "ガツガツグルメは、編集部の実食レポートとオリジナルコラムを軸にした、駅近・がっつり飯の専門メディアです。主要駅周辺のボリューム系の店を徒歩分数つきで探せる検索機能も提供しています。",
};

export default function AboutPage() {
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
        <Stack spacing={5}>
          {/* ヘッダーエリア */}
          <Box sx={{ textAlign: "center" }}>
            <WhatshotIcon sx={{ fontSize: "4rem", color: BRAND_COLOR, mb: 2 }} />
            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: "-0.02em", mb: 1 }}>
              ガツガツグルメとは
            </Typography>
            <Typography variant="subtitle1" sx={{ color: BRAND_COLOR, fontWeight: 800 }}>
              - 駅近「がっつり飯」ガイド＆実食メディア -
            </Typography>
          </Box>

          <Divider sx={{ borderBottomWidth: 3, borderColor: DARK_COLOR }} />

          {/* ミッションステートメント */}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <StarsIcon sx={{ color: BRAND_COLOR }} />
              私たちのミッション
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.8, mb: 2, color: DARK_COLOR }}>
              「空腹は、最大のスパイスではない。最大の『敵』だ。」
            </Typography>
            <Typography variant="body1" sx={{ color: "#444", lineHeight: 2 }}>
              現代の駅周辺は飲食店で溢れています。しかし、本当に腹が減っている時に「期待外れのボリューム」でガッカリした経験はありませんか？
              ガツガツグルメは、日々を全力で戦う人々の「腹を満たしたい」という本能に直接応えるため、駅から徒歩圏内の【がっつり飯】だけに絞って届ける特化型検索ガイドです。
            </Typography>
          </Box>

          {/* 独自基準（Googleへのアピール） */}
          <Box sx={{ bgcolor: "#F8F8F8", p: { xs: 3, md: 5 }, borderRadius: 6, border: `2px solid ${DARK_COLOR}` }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
              <CheckCircleOutlineIcon sx={{ color: BRAND_COLOR }} />
              厳格な掲載基準（キュレーションポリシー）
            </Typography>
            <Stack spacing={3}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography sx={{ fontWeight: 900, color: BRAND_COLOR, fontSize: "1.2rem" }}>01</Typography>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>圧倒的な満腹感（ボリューム）の保証</Typography>
                  <Typography variant="body2" sx={{ color: "#666", mt: 0.5 }}>
                    大盛り、デカ盛り、おかわり自由。提供される食事の「密度」と「量」に妥協がない店舗のみを抽出しています。
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography sx={{ fontWeight: 900, color: BRAND_COLOR, fontSize: "1.2rem" }}>02</Typography>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>「最速」でアクセス可能な立地条件</Typography>
                  <Typography variant="body2" sx={{ color: "#666", mt: 0.5 }}>
                    忙しい移動の合間でも立ち寄れるよう、駅周辺（概ね1km圏内）に特化。駅座標からの距離をもとに徒歩分数を自動計算し、全店舗に表示しています。
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography sx={{ fontWeight: 900, color: BRAND_COLOR, fontSize: "1.2rem" }}>03</Typography>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>独自の解析アルゴリズムによる選別</Typography>
                  <Typography variant="body2" sx={{ color: "#666", mt: 0.5 }}>
                    APIの生データをそのまま表示するのではなく、店名・カテゴリ・位置情報から独自ルールでジャンルを判定し、ラーメン・丼もの・定食などボリューム系のジャンルに該当する店舗のみを抽出しています。
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>

          {/* 信頼性への取り組み */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <InfoIcon sx={{ color: BRAND_COLOR }} />
              運営の透明性と正確性について
            </Typography>
            <Typography variant="body1" sx={{ color: "#444", lineHeight: 2 }}>
              ガツガツグルメでは、Google Maps API等の最新データを利用しつつ、情報の鮮度を保つために定期的なメンテナンスを行っています。
              また、ユーザーの皆様からの「ここもがっつりだった！」「情報が古い」といったリアルなフィードバックを元に、データベースを日々ブラッシュアップしています。
            </Typography>
            <Typography variant="body2" sx={{ mt: 3, p: 2, borderLeft: `4px solid ${BRAND_COLOR}`, bgcolor: "#FFF9F5", color: "#666" }}>
              ※掲載情報はAPIから取得したものを独自に加工・編集しています。最新の営業時間やメニューについては、必ずリンク先のGoogleマップ等で最終確認を行ってください。
            </Typography>
          </Box>

          <Divider sx={{ borderBottomWidth: 3, borderColor: DARK_COLOR }} />

          {/* コンテンツ制作方針 */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <CheckCircleOutlineIcon sx={{ color: BRAND_COLOR }} />
              コンテンツ制作方針
            </Typography>
            <Typography variant="body1" sx={{ color: "#444", lineHeight: 2 }}>
              当サイトの店舗情報は、Google Places APIの検索結果をもとに、店名・カテゴリ・位置情報から独自ルールでジャンルを判定し、
              「がっつり系」に該当する店舗のみを抽出・編集して掲載しています。徒歩分数は駅の座標と店舗の位置情報から独自に算出した目安です。
              あわせて、編集部が書き下ろした「
              <Box component="a" href="/column" sx={{ color: BRAND_COLOR, fontWeight: 800, textDecoration: "none" }}>がっつり飯コラム</Box>
              」では、二郎系の食べ方やデカ盛り完食のコツ、外食とカロリーの付き合い方など、店舗データに依存しない独自の読み物も提供しています。
              情報は定期的に見直し、誤りのご指摘をいただいた際は速やかに修正します。
            </Typography>
          </Box>

          <Divider sx={{ borderBottomWidth: 3, borderColor: DARK_COLOR }} />

          {/* 運営者情報 */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <InfoIcon sx={{ color: BRAND_COLOR }} />
              運営者情報
            </Typography>
            <Box sx={{ border: `2px solid ${DARK_COLOR}`, borderRadius: 4, overflow: "hidden" }}>
              {[
                { label: "サイト名", value: `${SITE_OPERATOR.siteName}（${SITE_OPERATOR.siteNameEn}）` },
                { label: "運営", value: SITE_OPERATOR.editorialName },
                { label: "運営責任者", value: SITE_OPERATOR.representativeName },
                { label: "開設", value: SITE_OPERATOR.established },
                { label: "サイトURL", value: SITE_OPERATOR.url },
                { label: "お問い合わせ", value: `お問い合わせフォーム・メール（${SITE_OPERATOR.contactEmail}）` },
                { label: "事業内容", value: "駅周辺のがっつり系グルメ情報の提供、外食関連の無料ツール・コラムの運営" },
                { label: "使用データ", value: "Google Places API ほか（独自に加工・編集のうえ掲載）" },
              ].map((row, i) => (
                <Box
                  key={row.label}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    borderTop: i === 0 ? "none" : "1px solid #EEE",
                  }}
                >
                  <Box sx={{ bgcolor: "#F8F8F8", p: 2, fontWeight: 900, color: DARK_COLOR, width: { xs: "100%", sm: 160 }, flexShrink: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 900 }}>{row.label}</Typography>
                  </Box>
                  <Box sx={{ p: 2, color: "#444" }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.8, wordBreak: "break-word" }}>{row.value}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Typography variant="body2" sx={{ mt: 2, color: "#666", lineHeight: 1.8 }}>
              掲載内容の修正依頼・店舗の推薦・その他のお問い合わせは、
              <Box component="a" href="/contact" sx={{ color: BRAND_COLOR, fontWeight: 800, textDecoration: "none" }}>お問い合わせページ</Box>
              よりお気軽にご連絡ください。
            </Typography>

            <Box sx={{ mt: 3 }}>
              <EditorProfile heading="運営・編集" />
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
