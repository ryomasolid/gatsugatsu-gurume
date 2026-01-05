"use client";

import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import RestaurantCard, { RestaurantInfoDTO } from "./components/RestaurantCard";

function RestaurantList() {
  const searchParams = useSearchParams();

  // useMemoで値を固定し、不要なuseEffectの実行を防ぐ
  const stationParam = useMemo(
    () => searchParams.get("station") || "周辺",
    [searchParams]
  );
  const latParam = useMemo(() => searchParams.get("lat") || "", [searchParams]);
  const lngParam = useMemo(() => searchParams.get("lng") || "", [searchParams]);

  const [restaurants, setRestaurants] = useState<RestaurantInfoDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 距離計算ロジック
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  useEffect(() => {
    if (stationParam === "周辺") {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          station: stationParam,
          lat: latParam,
          lng: lngParam,
        });
        const res = await fetch(`/api/restaurants?${query.toString()}`);
        const data = await res.json();

        if (!data.results) {
          setRestaurants([]);
          return;
        }

        const stationNames = stationParam.split(",");
        const stationLats = latParam.split(",").map(Number);
        const stationLngs = lngParam.split(",").map(Number);

        const formattedData: RestaurantInfoDTO[] = data.results.map(
          (place: any) => {
            let minWalkMinutes = 999;
            let nearestStationName = "駅";

            if (place.location && stationLats.length > 0) {
              stationLats.forEach((lat, index) => {
                const lng = stationLngs[index];
                if (!lat || !lng) return;
                const distance = calculateDistance(
                  lat,
                  lng,
                  place.location.latitude,
                  place.location.longitude
                );
                const minutes = Math.ceil(distance / 80);
                if (minutes < minWalkMinutes) {
                  minWalkMinutes = minutes;
                  nearestStationName = stationNames[index];
                }
              });
            }

            return {
              id: place.id,
              name: place.name,
              genre: place.genre,
              address: place.address,
              station:
                stationNames.length > 1
                  ? `${nearestStationName}駅(近)`
                  : `${nearestStationName}駅`,
              walkMinutes: minWalkMinutes === 999 ? 0 : minWalkMinutes,
              description: `評価: ★${place.rating} (${place.reviewCount}件の口コミ)`,
            };
          }
        );

        setRestaurants(formattedData.filter((v) => v.walkMinutes < 15));
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stationParam, latParam, lngParam]);

  return (
    <Container maxWidth="xl" sx={{ py: 1 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          textAlign: "center",
          fontWeight: 900,
          mb: { xs: 3, md: 6 },
          fontSize: { xs: "1.25rem", sm: "2rem", md: "3rem" },
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          color: "#1A1A1A",
          textShadow: "1.5px 1.5px 0px #FF6B00",
        }}
      >
        {stationParam.split(",").length > 2
          ? `${stationParam.split(",")[0]}...他${
              stationParam.split(",").length - 1
            }駅`
          : stationParam.split(",").join("・")}
        のガツガツグルメ
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : restaurants.length > 0 ? (
        <Grid container spacing={3}>
          {restaurants.map((r) => (
            <Grid key={r.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <RestaurantCard
                {...r}
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      r.name + " " + r.address
                    )}`,
                    "_blank"
                  )
                }
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ mt: 2, pb: 10 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 8 },
              borderRadius: 4,
              bgcolor: "#fff",
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 900,
                color: "#FF6B00",
                mb: 3,
                fontSize: {
                  xs: "0.85rem",
                  sm: "1.2rem",
                  md: "1.6rem",
                  lg: "1.6rem",
                },
              }}
            >
              ガツガツグルメ：駅近「がっつり飯」の最強検索ガイド
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 6,
                lineHeight: 2,
                color: "text.primary",
                fontSize: "1.1rem",
              }}
            >
              「ガツガツグルメ」へようこそ。当サイトは、日々を全力で生きる人々のために、
              <b>
                駅から徒歩圏内で、満足感抜群の「がっつり飯」を最速で見つけること
              </b>
              を目的に開発されました。
              巷に溢れるおしゃれなカフェ情報ではなく、私たちが本当に求めている「ラーメン・牛丼・定食」という黄金の3大ジャンルに特化しています。
            </Typography>

            <Divider sx={{ my: 6 }} />

            {/* コラムセクション1: ジャンル別こだわり */}
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  🍜 ラーメンの美学
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ lineHeight: 1.8, color: "text.secondary" }}
                >
                  「駅を降りて5分以内に、あの一杯を啜りたい。」そんな切実な願いに応えます。
                  濃厚な豚骨醤油から、背脂たっぷりのチャッチャ系、そして二郎インスパイアまで。
                  ガツガツグルメでは、ただのラーメン屋ではなく、食べた後に「戦える」元気が湧くお店をピックアップしています。
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  🍚 牛丼・丼物の信頼
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ lineHeight: 1.8, color: "text.secondary" }}
                >
                  日本が誇る究極のファストフード。大手チェーンの安定感はもちろん、その街にしかない「肉の盛り」が自慢の個人店まで網羅。
                  「安く、早く、そして大量に肉を食らいたい」という本能に忠実な検索結果をお届けします。
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  🍱 定食・おかわり自由の聖地
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ lineHeight: 1.8, color: "text.secondary" }}
                >
                  白米との真剣勝負。唐揚げ、生姜焼き、ハンバーグ。
                  ガツガツグルメの定食カテゴリーは、特にお腹を空かせた学生やビジネスマンに支持される、ボリューム自慢のお店を中心に抽出しています。
                </Typography>
              </Grid>
            </Grid>

            {/* 特集：2025年のがっつり飯トレンド（ここにテキストを増やす） */}
            <Box sx={{ mt: 8, p: 4, bgcolor: "grey.50", borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
                💡 2025年「駅近グルメ」の賢い探し方
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 2 }}>
                近年のグルメトレンドは、より「特化型」へと進化しています。
                ガツガツグルメが採用しているGoogle Places
                APIの最新データ（2025年版）を活用すれば、
                営業時間の変更や、新規開店したばかりの「隠れた名店」も逃さずチェック可能です。
                特に口コミ評価の数は、そのお店の「勢い」を示すバロメーター。私たちは常に最新の評価を反映させることで、
                あなたのランチ・ディナーでの「失敗」をゼロにすることを目指しています。
              </Typography>
            </Box>

            {/* --- 追加セクション：選定基準と楽しみ方 --- */}
            <Divider sx={{ my: 6 }} />

            <Typography
              variant="h5"
              sx={{ fontWeight: 900, mb: 4, textAlign: "center" }}
            >
              ガツガツグルメ流・お店選びの3か条
            </Typography>

            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{ p: 3, height: "100%", borderRadius: 3 }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mb: 1, color: "#FF6B00" }}
                  >
                    01. 圧倒的な「満腹度」
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    当サイトが紹介するのは、小腹を満たすためのお店ではありません。
                    「大盛り無料」「おかわり自由」「肉厚」など、食べた後に明日への活力が湧いてくるような、ボリューム自慢のお店を厳選しています。
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{ p: 3, height: "100%", borderRadius: 3 }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mb: 1, color: "#FF6B00" }}
                  >
                    02. 駅から「迷わず」行ける
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    空腹の限界で街を彷徨う時間はもったいない。
                    駅の改札を出てから数分以内に辿り着ける、アクセス抜群の立地条件を重視しています。
                    仕事の合間の短いランチタイムでも、最高のパフォーマンスを発揮できます。
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{ p: 3, height: "100%", borderRadius: 3 }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mb: 1, color: "#FF6B00" }}
                  >
                    03. 「生の声」を重視
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    広告費による順位操作ではなく、実際にその店を訪れたユーザーの口コミと評価（Google
                    Places APIデータ）をベースにしています。
                    本当においしい「がっつり飯」の真実をそのままお届けします。
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Box
              sx={{
                p: 4,
                bgcolor: "orange.50",
                borderRadius: 3,
                mb: 6,
                border: "1px solid #FFE0B2",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
                🔍 賢いガツガツ検索のテクニック
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 2 }}>
                当サイトの最大の特徴は、<b>「複数の駅を一度に選択できる」</b>
                点にあります。
                例えば、東急東横線の「武蔵小杉駅」と「元住吉駅」の両方にチェックを入れて検索すれば、その中間エリアにある隠れた名店も逃さずリストアップ可能です。
                この複数駅検索を駆使して、あなただけの「がっつり飯ルート」を開拓してみてください。
                最新の口コミスコアとリアルタイムな位置情報を組み合わせれば、もうお店選びで迷うことはありません。
              </Typography>
            </Box>

            {/* 使い方ガイド（UIの説明） */}
            <Box sx={{ mt: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
                🚀 検索の始め方
              </Typography>
              <Typography
                variant="body2"
                component="div"
                sx={{ color: "text.secondary" }}
              >
                1. 画面左上（スマホは三本線アイコン）のメニューを開く
                <br />
                2.
                「都道府県」と「路線」を選択し、目的の「駅」にチェックを入れる
                <br />
                3. 下部の「検索する」ボタンをタップ！
                <br />
                たったこれだけで、あなたの周囲は「がっつり飯のパラダイス」に変わります。
              </Typography>
            </Box>

            <Divider sx={{ my: 6 }} />

            <Typography variant="h5" sx={{ fontWeight: 900, mb: 4 }}>
              よくあるご質問（FAQ）
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "#FF6B00" }}
                >
                  Q. 掲載されているお店のジャンルは？
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  A.
                  ラーメン、牛丼、カレー、定食屋など、満足感の高い「がっつり飯」を中心に独自の抽出を行っています。
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "#FF6B00" }}
                >
                  Q. 複数の駅を同時に選ぶメリットは？
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  A.
                  徒歩や自転車で移動可能な範囲にある、隣接する駅の店舗をまとめて比較できるため、より選択肢が広がります。
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
    </Container>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <RestaurantList />
    </Suspense>
  );
}
