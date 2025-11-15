local ESP = {
    Enabled = true,
    TeamCheck = false,
    MaxDistance = 1000,
    BoxESP = true,
    NameESP = true,
    HealthESP = true,
    DistanceESP = true,
    TracerESP = false,
    BoxColor = Color3.fromRGB(255, 255, 255),
    TracerColor = Color3.fromRGB(255, 0, 0),
    TeamColor = true,
    UpdateRate = 0.05,
    VisibilityCheck = true
}

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")
local HttpService = game:GetService("HttpService")
local Camera = workspace.CurrentCamera
local LocalPlayer = Players.LocalPlayer
local PlayerGui = LocalPlayer:WaitForChild("PlayerGui")

local ESPObjects = {}
local ESPCache = {}

local function CreateNotification()
    local ScreenGui = Instance.new("ScreenGui")
    ScreenGui.Name = HttpService:GenerateGUID(false)
    ScreenGui.ResetOnSpawn = false
    ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
    ScreenGui.IgnoreGuiInset = true
    ScreenGui.Parent = PlayerGui
    
    local NotificationFrame = Instance.new("Frame")
    NotificationFrame.Name = "NotificationFrame"
    NotificationFrame.Size = UDim2.new(0, 0, 0, 0)
    NotificationFrame.Position = UDim2.new(1, 20, 1, 20)
    NotificationFrame.BackgroundColor3 = Color3.fromRGB(15, 15, 15)
    NotificationFrame.BorderSizePixel = 0
    NotificationFrame.ClipsDescendants = false
    NotificationFrame.AnchorPoint = Vector2.new(1, 1)
    NotificationFrame.Parent = ScreenGui
    
    local FrameCorner = Instance.new("UICorner")
    FrameCorner.CornerRadius = UDim.new(0, 16)
    FrameCorner.Parent = NotificationFrame
    
    local FrameStroke = Instance.new("UIStroke")
    FrameStroke.Color = Color3.fromRGB(45, 45, 45)
    FrameStroke.Thickness = 1
    FrameStroke.Transparency = 0
    FrameStroke.ApplyStrokeMode = Enum.ApplyStrokeMode.Border
    FrameStroke.Parent = NotificationFrame
    
    local ContentFrame = Instance.new("Frame")
    ContentFrame.Name = "ContentFrame"
    ContentFrame.Size = UDim2.new(1, 40, 1, 40)
    ContentFrame.Position = UDim2.new(0.5, 0, 0.5, 0)
    ContentFrame.AnchorPoint = Vector2.new(0.5, 0.5)
    ContentFrame.BackgroundTransparency = 1
    ContentFrame.Parent = NotificationFrame
    
    local ShadowImage = Instance.new("ImageLabel")
    ShadowImage.Name = "ShadowImage"
    ShadowImage.BackgroundTransparency = 1
    ShadowImage.Position = UDim2.new(0.5, 0, 0.5, 0)
    ShadowImage.Size = UDim2.new(1, 60, 1, 60)
    ShadowImage.AnchorPoint = Vector2.new(0.5, 0.5)
    ShadowImage.Image = "rbxassetid://5554236805"
    ShadowImage.ImageColor3 = Color3.fromRGB(0, 0, 0)
    ShadowImage.ImageTransparency = 0.7
    ShadowImage.ScaleType = Enum.ScaleType.Slice
    ShadowImage.SliceCenter = Rect.new(23, 23, 277, 277)
    ShadowImage.ZIndex = 0
    ShadowImage.Parent = ContentFrame
    
    local TitleLabel = Instance.new("TextLabel")
    TitleLabel.Name = "TitleLabel"
    TitleLabel.Size = UDim2.new(1, -40, 0, 28)
    TitleLabel.Position = UDim2.new(0, 20, 0, 20)
    TitleLabel.BackgroundTransparency = 1
    TitleLabel.Text = "Do you like the script?"
    TitleLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
    TitleLabel.TextSize = 15
    TitleLabel.Font = Enum.Font.GothamMedium
    TitleLabel.TextXAlignment = Enum.TextXAlignment.Left
    TitleLabel.TextTransparency = 1
    TitleLabel.Parent = ContentFrame
    
    local AuthorLabel = Instance.new("TextLabel")
    AuthorLabel.Name = "AuthorLabel"
    AuthorLabel.Size = UDim2.new(1, -40, 0, 18)
    AuthorLabel.Position = UDim2.new(0, 20, 0, 50)
    AuthorLabel.BackgroundTransparency = 1
    AuthorLabel.Text = "Made by vezekk#0"
    AuthorLabel.TextColor3 = Color3.fromRGB(160, 160, 160)
    AuthorLabel.TextSize = 12
    AuthorLabel.Font = Enum.Font.Gotham
    AuthorLabel.TextXAlignment = Enum.TextXAlignment.Left
    AuthorLabel.TextTransparency = 1
    AuthorLabel.Parent = ContentFrame
    
    local ButtonContainer = Instance.new("Frame")
    ButtonContainer.Name = "ButtonContainer"
    ButtonContainer.Size = UDim2.new(1, -40, 0, 44)
    ButtonContainer.Position = UDim2.new(0, 20, 0, 80)
    ButtonContainer.BackgroundTransparency = 1
    ButtonContainer.Parent = ContentFrame
    
    local CheckButton = Instance.new("TextButton")
    CheckButton.Name = "CheckButton"
    CheckButton.Size = UDim2.new(0.48, 0, 1, 0)
    CheckButton.Position = UDim2.new(0, 0, 0, 0)
    CheckButton.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
    CheckButton.BorderSizePixel = 0
    CheckButton.Text = ""
    CheckButton.AutoButtonColor = false
    CheckButton.BackgroundTransparency = 1
    CheckButton.Parent = ButtonContainer
    
    local CheckCorner = Instance.new("UICorner")
    CheckCorner.CornerRadius = UDim.new(0, 10)
    CheckCorner.Parent = CheckButton
    
    local CheckStroke = Instance.new("UIStroke")
    CheckStroke.Color = Color3.fromRGB(255, 255, 255)
    CheckStroke.Thickness = 2
    CheckStroke.Transparency = 0
    CheckStroke.ApplyStrokeMode = Enum.ApplyStrokeMode.Border
    CheckStroke.Parent = CheckButton
    
    local CheckLabel = Instance.new("TextLabel")
    CheckLabel.Size = UDim2.new(1, 0, 1, 0)
    CheckLabel.BackgroundTransparency = 1
    CheckLabel.Text = "✓"
    CheckLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
    CheckLabel.TextSize = 22
    CheckLabel.Font = Enum.Font.GothamBold
    CheckLabel.Parent = CheckButton
    
    local XButton = Instance.new("TextButton")
    XButton.Name = "XButton"
    XButton.Size = UDim2.new(0.48, 0, 1, 0)
    XButton.Position = UDim2.new(0.52, 0, 0, 0)
    XButton.BackgroundColor3 = Color3.fromRGB(0, 0, 0)
    XButton.BorderSizePixel = 0
    XButton.Text = ""
    XButton.AutoButtonColor = false
    XButton.BackgroundTransparency = 1
    XButton.Parent = ButtonContainer
    
    local XCorner = Instance.new("UICorner")
    XCorner.CornerRadius = UDim.new(0, 10)
    XCorner.Parent = XButton
    
    local XStroke = Instance.new("UIStroke")
    XStroke.Color = Color3.fromRGB(80, 80, 80)
    XStroke.Thickness = 2
    XStroke.Transparency = 0
    XStroke.ApplyStrokeMode = Enum.ApplyStrokeMode.Border
    XStroke.Parent = XButton
    
    local XIcon = Instance.new("ImageLabel")
    XIcon.Size = UDim2.new(0, 20, 0, 20)
    XIcon.Position = UDim2.new(0.5, 0, 0.5, 0)
    XIcon.AnchorPoint = Vector2.new(0.5, 0.5)
    XIcon.BackgroundTransparency = 1
    XIcon.Image = "rbxassetid://6031094678"
    XIcon.ImageColor3 = Color3.fromRGB(200, 200, 200)
    XIcon.Parent = XButton
    
    local SlideInTween = TweenService:Create(
        NotificationFrame,
        TweenInfo.new(0.7, Enum.EasingStyle.Exponential, Enum.EasingDirection.Out),
        {Size = UDim2.new(0, 340, 0, 144), Position = UDim2.new(1, -20, 1, -20)}
    )
    
    local TitleFadeTween = TweenService:Create(
        TitleLabel,
        TweenInfo.new(0.5, Enum.EasingStyle.Quint, Enum.EasingDirection.Out, 0, false, 0.3),
        {TextTransparency = 0}
    )
    
    local AuthorFadeTween = TweenService:Create(
        AuthorLabel,
        TweenInfo.new(0.5, Enum.EasingStyle.Quint, Enum.EasingDirection.Out, 0, false, 0.4),
        {TextTransparency = 0}
    )
    
    local ShadowFadeTween = TweenService:Create(
        ShadowImage,
        TweenInfo.new(0.6, Enum.EasingStyle.Quint, Enum.EasingDirection.Out, 0, false, 0.2),
        {ImageTransparency = 0.4}
    )
    
    local function AnimateButton(button, hoverBackgroundColor, stroke, hoverStrokeColor, textLabel)
        local isPressed = false
        
        button.MouseEnter:Connect(function()
            if isPressed then return end
            TweenService:Create(button, TweenInfo.new(0.3, Enum.EasingStyle.Quint, Enum.EasingDirection.Out), {BackgroundColor3 = hoverBackgroundColor}):Play()
            TweenService:Create(button, TweenInfo.new(0.3, Enum.EasingStyle.Back, Enum.EasingDirection.Out), {Size = UDim2.new(0.48, 0, 1, 6)}):Play()
            if stroke then
                TweenService:Create(stroke, TweenInfo.new(0.3, Enum.EasingStyle.Quint, Enum.EasingDirection.Out), {Color = hoverStrokeColor}):Play()
            end
            if textLabel then
                TweenService:Create(textLabel, TweenInfo.new(0.3, Enum.EasingStyle.Quint, Enum.EasingDirection.Out), {TextColor3 = Color3.fromRGB(15, 15, 15)}):Play()
            end
        end)
        
        button.MouseLeave:Connect(function()
            if isPressed then return end
            TweenService:Create(button, TweenInfo.new(0.3, Enum.EasingStyle.Quint, Enum.EasingDirection.Out), {BackgroundColor3 = Color3.fromRGB(0, 0, 0)}):Play()
            TweenService:Create(button, TweenInfo.new(0.3, Enum.EasingStyle.Back, Enum.EasingDirection.Out), {Size = UDim2.new(0.48, 0, 1, 0)}):Play()
            if stroke then
                TweenService:Create(stroke, TweenInfo.new(0.3, Enum.EasingStyle.Quint, Enum.EasingDirection.Out), {Color = button == CheckButton and Color3.fromRGB(255, 255, 255) or Color3.fromRGB(80, 80, 80)}):Play()
            end
            if textLabel then
                TweenService:Create(textLabel, TweenInfo.new(0.3, Enum.EasingStyle.Quint, Enum.EasingDirection.Out), {TextColor3 = Color3.fromRGB(255, 255, 255)}):Play()
            end
        end)
        
        button.MouseButton1Down:Connect(function()
            isPressed = true
            TweenService:Create(button, TweenInfo.new(0.15, Enum.EasingStyle.Quint, Enum.EasingDirection.Out), {Size = UDim2.new(0.48, 0, 1, -4)}):Play()
        end)
        
        button.MouseButton1Up:Connect(function()
            isPressed = false
            TweenService:Create(button, TweenInfo.new(0.15, Enum.EasingStyle.Quint, Enum.EasingDirection.Out), {Size = UDim2.new(0.48, 0, 1, 0)}):Play()
        end)
    end
    
    AnimateButton(CheckButton, Color3.fromRGB(255, 255, 255), CheckStroke, Color3.fromRGB(255, 255, 255), CheckLabel)
    AnimateButton(XButton, Color3.fromRGB(60, 60, 60), XStroke, Color3.fromRGB(120, 120, 120), nil)
    
    local function CloseNotification(response)
        local SlideOutTween = TweenService:Create(
            NotificationFrame,
            TweenInfo.new(0.5, Enum.EasingStyle.Exponential, Enum.EasingDirection.In),
            {Size = UDim2.new(0, 0, 0, 0), Position = UDim2.new(1, 20, 1, 20)}
        )
        
        local ContentMoveTween = TweenService:Create(
            ContentFrame,
            TweenInfo.new(0.4, Enum.EasingStyle.Quint, Enum.EasingDirection.In),
            {Position = UDim2.new(0.5, 0, 0.5, 30)}
        )
        
        local TitleFadeOut = TweenService:Create(
            TitleLabel,
            TweenInfo.new(0.3, Enum.EasingStyle.Quint, Enum.EasingDirection.In),
            {TextTransparency = 1}
        )
        
        local AuthorFadeOut = TweenService:Create(
            AuthorLabel,
            TweenInfo.new(0.3, Enum.EasingStyle.Quint, Enum.EasingDirection.In),
            {TextTransparency = 1}
        )
        
        SlideOutTween:Play()
        ContentMoveTween:Play()
        TitleFadeOut:Play()
        AuthorFadeOut:Play()
        SlideOutTween.Completed:Wait()
        ScreenGui:Destroy()
    end
    
    CheckButton.MouseButton1Click:Connect(function()
        CloseNotification("YES")
    end)
    
    XButton.MouseButton1Click:Connect(function()
        CloseNotification("NO")
    end)
    
    SlideInTween:Play()
    TitleFadeTween:Play()
    AuthorFadeTween:Play()
    ShadowFadeTween:Play()
end

local function IsAlive(player)
    if not player.Character then return false end
    local humanoid = player.Character:FindFirstChildOfClass("Humanoid")
    local rootPart = player.Character:FindFirstChild("HumanoidRootPart")
    return humanoid and rootPart and humanoid.Health > 0
end

local function GetTeamColor(player)
    if player.Team then
        return player.Team.TeamColor.Color
    end
    return Color3.fromRGB(255, 255, 255)
end

local function WorldToViewportPoint(position)
    local vector, onScreen = Camera:WorldToViewportPoint(position)
    return Vector2.new(vector.X, vector.Y), onScreen, vector.Z
end

local function CreateDrawing(type, properties)
    local drawing = Drawing.new(type)
    for property, value in pairs(properties) do
        drawing[property] = value
    end
    return drawing
end

local function GetCharacterBounds(character)
    local hrp = character:FindFirstChild("HumanoidRootPart")
    local head = character:FindFirstChild("Head")
    
    if not hrp or not head then return nil end
    
    local headTop = head.Position + Vector3.new(0, head.Size.Y / 2, 0)
    local feetBottom = hrp.Position - Vector3.new(0, hrp.Size.Y / 2 + 2.5, 0)
    
    return headTop, feetBottom, hrp.Position
end

local function CreateESP(player)
    local esp = {
        Box = CreateDrawing("Square", {
            Thickness = 2,
            Filled = false,
            Transparency = 1,
            Color = ESP.BoxColor,
            Visible = false
        }),
        Name = CreateDrawing("Text", {
            Size = 16,
            Center = true,
            Outline = true,
            Color = Color3.fromRGB(255, 255, 255),
            Visible = false,
            Font = 2
        }),
        Health = CreateDrawing("Text", {
            Size = 14,
            Center = true,
            Outline = true,
            Color = Color3.fromRGB(0, 255, 0),
            Visible = false,
            Font = 2
        }),
        Distance = CreateDrawing("Text", {
            Size = 14,
            Center = true,
            Outline = true,
            Color = Color3.fromRGB(255, 255, 255),
            Visible = false,
            Font = 2
        }),
        Tracer = CreateDrawing("Line", {
            Thickness = 1.5,
            Transparency = 1,
            Color = ESP.TracerColor,
            Visible = false
        }),
        HealthBar = CreateDrawing("Square", {
            Thickness = 1,
            Filled = true,
            Transparency = 1,
            Color = Color3.fromRGB(0, 255, 0),
            Visible = false
        }),
        HealthBarOutline = CreateDrawing("Square", {
            Thickness = 1,
            Filled = false,
            Transparency = 1,
            Color = Color3.fromRGB(0, 0, 0),
            Visible = false
        })
    }
    
    ESPObjects[player] = esp
    ESPCache[player] = {
        LastPosition = Vector2.new(0, 0),
        LastSize = Vector2.new(0, 0),
        Smoothing = 0.2
    }
end

local function RemoveESP(player)
    if ESPObjects[player] then
        for _, drawing in pairs(ESPObjects[player]) do
            drawing:Remove()
        end
        ESPObjects[player] = nil
        ESPCache[player] = nil
    end
end

local function SmoothValue(current, target, smoothing)
    return current + (target - current) * smoothing
end

local function UpdateESP(player, esp)
    if not ESP.Enabled or not IsAlive(player) or player == LocalPlayer then
        for _, drawing in pairs(esp) do
            drawing.Visible = false
        end
        return
    end
    
    if ESP.TeamCheck and player.Team == LocalPlayer.Team then
        for _, drawing in pairs(esp) do
            drawing.Visible = false
        end
        return
    end
    
    local character = player.Character
    local rootPart = character:FindFirstChild("HumanoidRootPart")
    local humanoid = character:FindFirstChildOfClass("Humanoid")
    
    if not rootPart or not humanoid then
        for _, drawing in pairs(esp) do
            drawing.Visible = false
        end
        return
    end
    
    local distance = (Camera.CFrame.Position - rootPart.Position).Magnitude
    if distance > ESP.MaxDistance then
        for _, drawing in pairs(esp) do
            drawing.Visible = false
        end
        return
    end
    
    local color = ESP.TeamColor and GetTeamColor(player) or ESP.BoxColor
    
    local headTop, feetBottom, center = GetCharacterBounds(character)
    if not headTop then return end
    
    local topPos, topOnScreen = WorldToViewportPoint(headTop)
    local bottomPos, bottomOnScreen = WorldToViewportPoint(feetBottom)
    
    if not topOnScreen and not bottomOnScreen then
        for _, drawing in pairs(esp) do
            drawing.Visible = false
        end
        return
    end
    
    local height = math.abs(topPos.Y - bottomPos.Y)
    local width = height / 2
    
    local cache = ESPCache[player]
    local targetPos = Vector2.new(bottomPos.X - width / 2, topPos.Y)
    local targetSize = Vector2.new(width, height)
    
    local smoothPos = Vector2.new(
        SmoothValue(cache.LastPosition.X, targetPos.X, cache.Smoothing),
        SmoothValue(cache.LastPosition.Y, targetPos.Y, cache.Smoothing)
    )
    
    local smoothSize = Vector2.new(
        SmoothValue(cache.LastSize.X, targetSize.X, cache.Smoothing),
        SmoothValue(cache.LastSize.Y, targetSize.Y, cache.Smoothing)
    )
    
    cache.LastPosition = smoothPos
    cache.LastSize = smoothSize
    
    if ESP.BoxESP then
        esp.Box.Size = smoothSize
        esp.Box.Position = smoothPos
        esp.Box.Color = color
        esp.Box.Visible = true
    else
        esp.Box.Visible = false
    end
    
    if ESP.NameESP then
        esp.Name.Text = player.Name
        esp.Name.Position = Vector2.new(smoothPos.X + smoothSize.X / 2, smoothPos.Y - 20)
        esp.Name.Color = color
        esp.Name.Visible = true
    else
        esp.Name.Visible = false
    end
    
    if ESP.HealthESP then
        local health = math.floor(humanoid.Health)
        local maxHealth = math.floor(humanoid.MaxHealth)
        esp.Health.Text = health .. " HP"
        esp.Health.Position = Vector2.new(smoothPos.X + smoothSize.X / 2, smoothPos.Y + smoothSize.Y + 5)
        
        local healthPercent = math.clamp(health / maxHealth, 0, 1)
        esp.Health.Color = Color3.fromRGB(
            255 * (1 - healthPercent),
            255 * healthPercent,
            0
        )
        esp.Health.Visible = true
        
        local barHeight = smoothSize.Y
        local barWidth = 4
        local healthHeight = barHeight * healthPercent
        
        esp.HealthBar.Size = Vector2.new(barWidth, healthHeight)
        esp.HealthBar.Position = Vector2.new(smoothPos.X - 6, smoothPos.Y + (barHeight - healthHeight))
        esp.HealthBar.Color = Color3.fromRGB(255 * (1 - healthPercent), 255 * healthPercent, 0)
        esp.HealthBar.Visible = true
        
        esp.HealthBarOutline.Size = Vector2.new(barWidth + 2, barHeight + 2)
        esp.HealthBarOutline.Position = Vector2.new(smoothPos.X - 7, smoothPos.Y - 1)
        esp.HealthBarOutline.Visible = true
    else
        esp.Health.Visible = false
        esp.HealthBar.Visible = false
        esp.HealthBarOutline.Visible = false
    end
    
    if ESP.DistanceESP then
        esp.Distance.Text = math.floor(distance) .. "m"
        esp.Distance.Position = Vector2.new(smoothPos.X + smoothSize.X / 2, smoothPos.Y + smoothSize.Y + 20)
        esp.Distance.Visible = true
    else
        esp.Distance.Visible = false
    end
    
    if ESP.TracerESP then
        local from = Vector2.new(Camera.ViewportSize.X / 2, Camera.ViewportSize.Y)
        esp.Tracer.From = from
        esp.Tracer.To = Vector2.new(smoothPos.X + smoothSize.X / 2, smoothPos.Y + smoothSize.Y)
        esp.Tracer.Color = color
        esp.Tracer.Visible = true
    else
        esp.Tracer.Visible = false
    end
end

local function OnPlayerAdded(player)
    if player == LocalPlayer then return end
    
    CreateESP(player)
    
    player.CharacterAdded:Connect(function()
        task.wait(0.5)
        if ESPCache[player] then
            ESPCache[player].LastPosition = Vector2.new(0, 0)
            ESPCache[player].LastSize = Vector2.new(0, 0)
        end
    end)
end

local function OnPlayerRemoving(player)
    RemoveESP(player)
end

for _, player in ipairs(Players:GetPlayers()) do
    OnPlayerAdded(player)
end

Players.PlayerAdded:Connect(OnPlayerAdded)
Players.PlayerRemoving:Connect(OnPlayerRemoving)

RunService.RenderStepped:Connect(function()
    if not ESP.Enabled then return end
    
    for player, esp in pairs(ESPObjects) do
        if player and player.Parent then
            pcall(function()
                UpdateESP(player, esp)
            end)
        else
            RemoveESP(player)
        end
    end
end)

function ESP:Toggle()
    self.Enabled = not self.Enabled
    if not self.Enabled then
        for _, esp in pairs(ESPObjects) do
            for _, drawing in pairs(esp) do
                drawing.Visible = false
            end
        end
    end
    print("ESP:", self.Enabled and "ON" or "OFF")
end

function ESP:SetMaxDistance(distance)
    self.MaxDistance = distance
    print("Max Distance set to:", distance)
end

function ESP:ToggleTeamCheck()
    self.TeamCheck = not self.TeamCheck
    print("Team Check:", self.TeamCheck and "ON" or "OFF")
end

game:GetService("UserInputService").InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    
    if input.KeyCode == Enum.KeyCode.Insert then
        ESP:Toggle()
    elseif input.KeyCode == Enum.KeyCode.Home then
        ESP:ToggleTeamCheck()
    end
end)

CreateNotification()
print("ESP Loaded! Press INSERT to toggle | HOME for team check")
return ESP
