import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StatusBar, Keyboard } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { SafeAreaView } from 'react-native-safe-area-context'
// Define message type
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

// Sample FAQ responses
const faqResponses: Record<string, string> = {
  'add expense': 'To add an expense, go to the Expenses tab and tap the "+" button. Fill in the details like amount, category, and description, then tap "Save".',
  'add trip': 'To add a new trip, go to the Home screen and tap the "+" button. Enter the destination details and save it.',
  'change currency': 'You can change your currency by going to Profile > Currency, then selecting your preferred currency from the list.',
  'export data': 'To export your expense data, go to Profile > Export Data, then choose the format (Excel or text) and which trips to include.',
  'change theme': 'To change the app theme, go to Profile and tap on "Theme". This will cycle between light, dark, and system modes.',
  'delete expense': 'To delete an expense, open the specific trip, find the expense, swipe left, and tap the delete button.',
  'budget': 'We\'re working on adding budgeting features in a future update. Stay tuned!',
  'statistics': 'You can view spending statistics by going to Profile > Statistics to see charts and breakdowns of your expenses.',
  'help': 'I\'m your Budgetfy assistant! Ask me questions about using the app, and I\'ll try to help you. What would you like to know?',
  'thanks': 'You\'re welcome! Is there anything else you\'d like to know about Budgetfy?',
  'thank': 'You\'re welcome! I\'m happy to help. Is there anything else you need assistance with?',
  'no': 'Alright! If you have any questions in the future, feel free to ask. Happy budgeting!',
};

export default function HelpScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { isDark } = useSelector((state: RootState) => state.theme);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Budgetfy assistant. How can I help you today?',
      sender: 'bot',
      timestamp: Date.now(),
    },
  ]);
  
  // Add quick suggestion topics - now organized by categories
  const quickSuggestions = [
    'Add expense', 
    'Add trip',
    'Change currency', 
    'Export data', 
    'Change theme',
    'Statistics',
    'Delete expense',
    'Budget'
  ];
  
  const flatListRef = useRef<FlatList>(null);
  
  // Control whether to show the suggestion grid or the chat interface
  const [showSuggestionGrid, setShowSuggestionGrid] = useState(messages.length <= 1);
  
  // Handle keyboard events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setShowSuggestionGrid(false);
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      // Only show grid if we're at initial state
      if (messages.length <= 1) {
        setShowSuggestionGrid(true);
      }
    });
    
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [messages.length]);

  // Function to generate bot response
  const generateBotResponse = (userMessage: string): string => {
    const normalizedInput = userMessage.toLowerCase();
    
    // Check for keyword matches in FAQ
    for (const [keyword, response] of Object.entries(faqResponses)) {
      if (normalizedInput.includes(keyword)) {
        return response;
      }
    }
    
    // Default fallback responses
    const fallbackResponses = [
      "I'm not sure I understand. Can you rephrase your question?",
      "I don't have information about that yet. Is there something else I can help with?",
      "That's beyond my current knowledge. For detailed help, please refer to our documentation.",
      "I'm still learning! Could you ask about another feature of Budgetfy?",
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: Date.now(),
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputText('');
    setShowSuggestionGrid(false);
    
    // Simulate bot thinking then respond
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        sender: 'bot',
        timestamp: Date.now(),
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
      
      // Scroll to the bottom
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 500);
  };

  // Handle quick suggestion tap
  const handleSuggestionTap = (suggestion: string) => {
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: suggestion,
      sender: 'user',
      timestamp: Date.now(),
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setShowSuggestionGrid(false);
    
    // Simulate bot thinking then respond
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(suggestion.toLowerCase()),
        sender: 'bot',
        timestamp: Date.now(),
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
      
      // Scroll to the bottom
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 500);
  };

  // Render a chat message
  const renderMessage = ({ item }: { item: Message }) => {
    const isBot = item.sender === 'bot';
    
    return (
      <View style={[
        styles.messageContainer,
        isBot ? styles.botMessageContainer : styles.userMessageContainer
      ]}>
        {isBot && (
          <View style={[styles.botAvatarContainer, { backgroundColor: isDark ? theme.colors.card : '#fff' }]}>
            <Icon name="help-circle" size={24} color={theme.colors.primary} />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isBot
            ? [styles.botBubble, { backgroundColor: theme.colors.secondary }]
            : [styles.userBubble, { backgroundColor: theme.colors.primary }]
        ]}>
          <Text style={[
            styles.messageText, 
            { color: isBot ? theme.colors.text : '#fff' }
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            { color: isBot ? theme.colors.grey : 'rgba(255,255,255,0.7)' }
          ]}>
            {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
        </View>
      </View>
    );
  };

  // Render suggestion grid
  const renderSuggestionGrid = () => {
    return (
      <View style={styles.suggestionGridContainer}>
        <View style={[
          styles.welcomeMessageContainer, 
          { 
            backgroundColor: isDark ? theme.colors.card : theme.colors.secondary,
            borderWidth: 1,
            borderColor: theme.colors.border
          }
        ]}>
          <Icon name="help-circle" size={30} color={theme.colors.primary} style={styles.welcomeIcon} />
          <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>Budgetfy Support</Text>
          <Text style={[styles.welcomeSubtitle, { color: theme.colors.text }]}>
            Please select what you need help with:
          </Text>
        </View>
        
        <View style={styles.pillButtonsContainer}>
          {quickSuggestions.map((suggestion, index) => (
            <TouchableOpacity 
              key={index}
              activeOpacity={0.7}
              style={[
                styles.pillButton, 
                { 
                  backgroundColor: isDark ? '#007AFF' : '#0066CC',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'transparent',
                }
              ]}
              onPress={() => handleSuggestionTap(suggestion)}
            >
              <Text style={[styles.pillButtonText, { color: '#FFFFFF' }]}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Help & Support</Text>
      </View>

      {/* Main Content - Either Suggestion Grid or Chat */}
      {showSuggestionGrid ? (
        renderSuggestionGrid()
      ) : (
        <>
          {/* Chat Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            ListHeaderComponent={null}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesContainer}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />

          {/* Input Area */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            style={[
              styles.inputContainer, 
              { 
                backgroundColor: theme.colors.card,
                paddingBottom: Platform.OS === 'android' ? 10 : 0,
                borderTopColor: theme.colors.border 
              }
            ]}
          >
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your question here..."
              placeholderTextColor={theme.colors.lightGrey}
              returnKeyType="send"
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton, 
                { 
                  backgroundColor: inputText.trim() === '' ? theme.colors.lightGrey : theme.colors.primary,
                  opacity: inputText.trim() === '' ? 0.7 : 1
                }
              ]}
              onPress={handleSendMessage}
              disabled={inputText.trim() === ''}
            >
              <Icon name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'android' ? 10 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  backButton: {
    padding: 5,
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    maxWidth: '80%',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  botAvatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    maxWidth: '100%',
  },
  botBubble: {
    borderTopLeftRadius: 4,
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // New styles for suggestion grid
  suggestionGridContainer: {
    flex: 1,
    padding: 15,
  },
  welcomeMessageContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  welcomeIcon: {
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  pillButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  pillButton: {
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  pillButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});