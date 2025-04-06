"use client";
import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  Activity,
  Clock,
  TrendingUp,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ReactMarkdown from "react-markdown";

export default function Injury() {
  // States for form data and API responses
  const [loading, setLoading] = useState(false);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [formData, setFormData] = useState({
    Player_Weight: "75.0",
    Severity_Level: "Moderate",
    Match_Frequency: "6",
    Sleep_Hours: "7.5",
    Player_Age: "25",
    Previous_Injuries: "2",
    Injury_Type: "Muscle Strain",

    Player_Height: "180",
    Training_Intensity: "0.616",
    Training_Load: "17",
    Nutrition_Score: "8",
    Hydration_Level: "1.6",
    Physiotherapy_Sessions: "1",
    Dataset_Split: "train",
  });

  // Refs for scrolling
  const predictionRef = useRef(null);
  const recommendationRef = useRef(null);

  // Effect to scroll to prediction when it's loaded
  useEffect(() => {
    if (prediction && predictionRef.current && !recommendationLoading) {
      predictionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [prediction, recommendationLoading]);

  // Effect to scroll to recommendation when it's loaded (after prediction)
  useEffect(() => {
    if (recommendation && recommendationRef.current && !recommendationLoading) {
      recommendationRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recommendation, recommendationLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPredictionLoading(true);
    setRecommendationLoading(true);

    // Reset previous results when starting a new request
    setPrediction(null);
    setRecommendation("");

    try {
      // Create the required data object for both APIs
      const requiredData = {
        Player_Age: formData.Player_Age,
        Player_Weight: formData.Player_Weight,
        Severity_Level: formData.Severity_Level,
        Previous_Injuries: formData.Previous_Injuries,
        Injury_Type: formData.Injury_Type,
        Match_Frequency: formData.Match_Frequency,
        Sleep_Hours: formData.Sleep_Hours,
      };

      // First API call for recovery prediction
      const recoveryResponse = await fetch("/api/ai/recovery-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputData: formData }),
      });

      const recoveryResult = await recoveryResponse.json();

      if (!recoveryResult.success) {
        throw new Error(recoveryResult.error || "Failed to get prediction");
      }
      console.log(recoveryResult);
      const predictionValue =
        recoveryResult.predictedDays || recoveryResult.prediction;
      setPrediction({
        days: predictionValue,
        raw: predictionValue,
        confidence: recoveryResult.prediction.confidenceScore || 0.85,
      });

      setPredictionLoading(false);

      const recommendationResponse = await fetch("/api/ai/injury-do-dont", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requiredData),
      });

      const recommendationData = await recommendationResponse.json();

      if (!recommendationResponse.ok) {
        throw new Error(
          recommendationData.error || "Failed to get recommendations"
        );
      }

      setRecommendation(recommendationData.result);
      setRecommendationLoading(false);
    } catch (error) {
      console.error(error);
      alert(`Request Failed: ${error.message}`);
      setPredictionLoading(false);
      setRecommendationLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const getRecoveryRange = () => {
    if (!prediction) return { min: 0, max: 0 };
    const days = prediction.days;
    return {
      min: Math.max(1, Math.floor(days * 0.85)),
      max: Math.ceil(days * 1.15),
    };
  };

  const getSeverityColor = (days) => {
    if (days <= 10) return "text-green-500";
    if (days <= 25) return "text-amber-500";
    return "text-red-500";
  };

  const getProgressValue = (days) => {
    const maxDays = 60;
    return Math.min(100, (days / maxDays) * 100);
  };

  return (
    <div className="w-full lg:w-5/12 mx-auto p-4 py-20">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Activity className="h-6 w-6" />
            Recovery Prediction
          </CardTitle>
          <CardDescription>
            Predict athlete recovery time and get personalized recommendations
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="Player_Weight" className="text-sm font-medium">
                  Player Weight (kg)
                </Label>
                <Input
                  id="Player_Weight"
                  name="Player_Weight"
                  type="number"
                  step="0.1"
                  min="30"
                  max="150"
                  value={formData.Player_Weight}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="Player_Age" className="text-sm font-medium">
                  Player Age (years)
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="Player_Age"
                    defaultValue={[Number.parseInt(formData.Player_Age)]}
                    min={16}
                    max={80}
                    step={1}
                    onValueChange={(value) =>
                      handleSelectChange("Player_Age", value[0].toString())
                    }
                    className="flex-1"
                  />
                  <div className="w-12 text-center font-medium">
                    {formData.Player_Age}
                  </div>
                </div>
              </div>

              {/* Injury Type Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="Injury_Type" className="text-sm font-medium">
                  Injury Type
                </Label>
                <Select
                  value={formData.Injury_Type}
                  onValueChange={(value) =>
                    handleSelectChange("Injury_Type", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select injury type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ligament Tear">Ligament Tear</SelectItem>
                    <SelectItem value="Muscle Strain">Muscle Strain</SelectItem>
                    <SelectItem value="Sprain">Sprain</SelectItem>
                    <SelectItem value="Fracture">Fracture</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Severity Level */}
              <div className="space-y-2">
                <Label htmlFor="Severity_Level" className="text-sm font-medium">
                  Injury Severity
                </Label>
                <Select
                  value={formData.Severity_Level}
                  onValueChange={(value) =>
                    handleSelectChange("Severity_Level", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mild">Mild</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Match Frequency */}
              <div className="space-y-2">
                <Label
                  htmlFor="Match_Frequency"
                  className="text-sm font-medium"
                >
                  Match Frequency (per month)
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="Match_Frequency"
                    defaultValue={[Number.parseInt(formData.Match_Frequency)]}
                    max={12}
                    step={1}
                    onValueChange={(value) =>
                      handleSelectChange("Match_Frequency", value[0].toString())
                    }
                    className="flex-1"
                  />
                  <div className="w-12 text-center font-medium">
                    {formData.Match_Frequency}
                  </div>
                </div>
              </div>

              {/* Sleep Hours */}
              <div className="space-y-2">
                <Label htmlFor="Sleep_Hours" className="text-sm font-medium">
                  Sleep Hours (per day)
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="Sleep_Hours"
                    defaultValue={[Number.parseFloat(formData.Sleep_Hours)]}
                    min={4}
                    max={12}
                    step={0.5}
                    onValueChange={(value) =>
                      handleSelectChange("Sleep_Hours", value[0].toString())
                    }
                    className="flex-1"
                  />
                  <div className="w-12 text-center font-medium">
                    {formData.Sleep_Hours}
                  </div>
                </div>
              </div>

              {/* Previous Injuries (Radio Buttons) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Previous Injuries</Label>
                <RadioGroup
                  value={formData.Previous_Injuries}
                  onValueChange={(value) =>
                    handleSelectChange("Previous_Injuries", value)
                  }
                  className="grid grid-cols-2 gap-2 pt-2"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-2">
                    <RadioGroupItem value="1" id="injuries-1" />
                    <Label htmlFor="injuries-1" className="cursor-pointer">
                      1
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-2">
                    <RadioGroupItem value="2" id="injuries-2" />
                    <Label htmlFor="injuries-2" className="cursor-pointer">
                      2
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-2">
                    <RadioGroupItem value="3" id="injuries-3" />
                    <Label htmlFor="injuries-3" className="cursor-pointer">
                      3
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-2">
                    <RadioGroupItem value="4+" id="injuries-4plus" />
                    <Label htmlFor="injuries-4plus" className="cursor-pointer">
                      More than 3
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Calculating...
                </span>
              ) : (
                "Get Recovery Analysis"
              )}
            </Button>
          </form>
        </CardContent>

        {/* Display prediction section or loading state */}
        {(prediction || predictionLoading) && (
          <CardFooter
            ref={predictionRef}
            className="flex flex-col space-y-4 border-t bg-muted/30 p-6"
          >
            {predictionLoading ? (
              <div className="w-full flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">
                  Calculating recovery time...
                </p>
              </div>
            ) : (
              prediction && (
                <>
                  <div className="w-full space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">
                        Predicted Recovery
                      </h3>
                      <span
                        className={`text-xl font-bold ${getSeverityColor(
                          prediction.days
                        )}`}
                      >
                        {prediction.days} days
                      </span>
                    </div>
                    <Progress
                      value={getProgressValue(prediction.days)}
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    <Card className="border shadow-sm">
                      <CardContent className="p-4 space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Recovery Range</span>
                        </div>
                        <p className="text-lg font-semibold">
                          {getRecoveryRange().min}-{getRecoveryRange().max} days
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border shadow-sm">
                      <CardContent className="p-4 space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span>Confidence</span>
                        </div>
                        <p className="text-lg font-semibold">
                          {Math.round(prediction.confidence * 100)}%
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-sm text-muted-foreground flex items-start gap-2 pt-2">
                    <AlertCircle className="h-4 w-4 mt-0.5" />
                    <p>
                      Recovery time may vary based on individual factors.
                      Regular follow-ups with medical staff recommended.
                    </p>
                  </div>
                </>
              )
            )}

            {/* Recommendations Section with loading state */}
            <div ref={recommendationRef} className="w-full mt-4">
              <Card className="w-full border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Recovery Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recommendationLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Generating personalized recommendations...
                      </p>
                    </div>
                  ) : recommendation ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{recommendation}</ReactMarkdown>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
